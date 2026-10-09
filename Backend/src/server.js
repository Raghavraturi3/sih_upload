import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB, getDBStatus } from './config/db.js';
import { autoSeedIfEmpty } from './seed.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import expeditionRoutes from './routes/expeditions.js';
import trackingRoutes, { BACKEND_VESSELS, BACKEND_AIRCRAFT } from './routes/tracking.js';
import antarcticaRoutes from './routes/antarctica.js';
import digitalTwinRoutes from './routes/digitalTwin.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize WebSocket Server for Live Tracking
const wss = new WebSocketServer({ server, path: '/ws/tracking' });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'TRACKING_CONNECTION_STATUS',
    data: { status: 'CONNECTED', message: 'Subscribed to Antarctic AIS/ADS-B Live Feeds' }
  }));
});

// Periodic position delta broadcast (every 5 seconds)
setInterval(() => {
  if (wss.clients.size === 0) return;

  BACKEND_VESSELS.forEach(v => {
    const deltaLat = (Math.random() - 0.49) * 0.002;
    const deltaLon = (Math.random() - 0.49) * 0.002;
    v.latitude += deltaLat;
    v.longitude += deltaLon;

    const payload = JSON.stringify({
      type: 'VESSEL_POSITION_UPDATED',
      data: {
        mmsi: v.mmsi,
        name: v.name,
        latitude: v.latitude,
        longitude: v.longitude,
        speed: v.speedKnots,
        heading: v.heading,
        timestamp: new Date().toISOString()
      }
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(payload);
    });
  });

  BACKEND_AIRCRAFT.forEach(a => {
    const deltaLat = (Math.random() - 0.48) * 0.005;
    const deltaLon = (Math.random() - 0.48) * 0.005;
    a.latitude += deltaLat;
    a.longitude += deltaLon;

    const payload = JSON.stringify({
      type: 'AIRCRAFT_POSITION_UPDATED',
      data: {
        icao24: a.icao24,
        callsign: a.callsign,
        latitude: a.latitude,
        longitude: a.longitude,
        altitude: a.altitude,
        heading: a.heading,
        timestamp: new Date().toISOString()
      }
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(payload);
    });
  });
}, 5000);

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expeditions', expeditionRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/antarctica', antarcticaRoutes);
app.use('/api/weather', antarcticaRoutes);
app.use('/api/satellite', antarcticaRoutes);
app.use('/api/digital-twin', digitalTwinRoutes);
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Antarctic Digital Twin API Server (Secure Management Portal)',
    version: '2.0.0',
    mongodb: getDBStatus(),
    endpoints: [
      '/api/auth/login',
      '/api/auth/logout',
      '/api/auth/me',
      '/api/admin/users',
      '/api/admin/audit-logs',
      '/api/expeditions/routes',
      '/api/tracking/vessels',
      '/api/tracking/aircraft',
      '/api/tracking/shipments',
      '/ws/tracking'
    ]
  });
});

// Start Server
async function startServer() {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    server.listen(PORT, () => {
      console.log(`🚀 [Server] Digital Twin Backend running on http://localhost:${PORT}`);
      console.log(`📡 [Server] WebSocket tracking live on ws://localhost:${PORT}/ws/tracking`);
      console.log(`🛡️  [Server] RBAC & Tracking subsystem active`);
    });
  } catch (err) {
    console.error('❌ [Server] Fatal startup error:', err.message);
    process.exit(1);
  }
}

startServer();
