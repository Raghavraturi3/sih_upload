// Backend API Router — Expedition & Convoy Route Intelligence
import express from 'express';
import { AuditLog } from '../models/AuditLog.js';

const router = express.Router();

// Seeded / configured in-memory dataset matching Antarctic corridors
const ROUTE_DATA = [
  {
    id: 'M-01',
    code: 'M-01',
    name: 'Maitri → Novolazarevskaya Airfield Corridor',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'CONVOY',
    status: 'NORMAL',
    distanceKm: 16.4,
    estimatedTravelHours: 1.5,
    lastObservation: '12 Sept 2026, 13:45 UTC',
    riskScore: 18
  },
  {
    id: 'M-03',
    code: 'M-03',
    name: 'Maitri → Field Site A (Wohlthat Mountains)',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'SCIENTIFIC',
    status: 'CAUTION',
    distanceKm: 42.6,
    estimatedTravelHours: 5.3,
    lastObservation: '12 Sept 2026, 12:20 UTC',
    riskScore: 62
  },
  {
    id: 'M-04',
    code: 'M-04',
    name: 'Maitri → Field Site A (Western Nunatak Alternate)',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'SCIENTIFIC',
    status: 'NORMAL',
    distanceKm: 51.0,
    estimatedTravelHours: 6.2,
    lastObservation: '12 Sept 2026, 11:30 UTC',
    riskScore: 41
  },
  {
    id: 'M-02',
    code: 'M-02',
    name: 'Maitri → South Polar Fuel Cache Delta',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'LOGISTICS',
    status: 'REVIEW_REQUIRED',
    distanceKm: 68.2,
    estimatedTravelHours: 8.5,
    lastObservation: '12 Sept 2026, 10:15 UTC',
    riskScore: 71
  },
  {
    id: 'M-05',
    code: 'M-05',
    name: 'Willy Field Glacier Emergency Traverse',
    stationId: 'MAITRI',
    stationName: 'Maitri',
    type: 'EMERGENCY',
    status: 'HIGH_ATTENTION',
    distanceKm: 28.5,
    estimatedTravelHours: 3.2,
    lastObservation: '11 Sept 2026, 08:30 UTC',
    riskScore: 88
  },
  {
    id: 'B-01',
    code: 'B-01',
    name: 'Bharati → Prydz Bay Fast-Ice Route',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'SEA_ICE',
    status: 'CAUTION',
    distanceKm: 14.8,
    estimatedTravelHours: 1.8,
    lastObservation: '12 Sept 2026, 13:10 UTC',
    riskScore: 58
  },
  {
    id: 'B-02',
    code: 'B-02',
    name: 'Bharati → Resupply Ship Heavy Logistics Route',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'LOGISTICS',
    status: 'NORMAL',
    distanceKm: 11.2,
    estimatedTravelHours: 1.2,
    lastObservation: '12 Sept 2026, 14:00 UTC',
    riskScore: 22
  },
  {
    id: 'B-03',
    code: 'B-03',
    name: 'Bharati → Amery Ice Shelf Research Traverse',
    stationId: 'BHARATI',
    stationName: 'Bharati',
    type: 'SCIENTIFIC',
    status: 'NORMAL',
    distanceKm: 84.5,
    estimatedTravelHours: 9.8,
    lastObservation: '12 Sept 2026, 12:45 UTC',
    riskScore: 34
  }
];

const EXPEDITIONS_DATA = [
  {
    id: 'EXP-021',
    title: 'Wohlthat Ice-Core Climate Survey',
    stationId: 'MAITRI',
    routeId: 'M-03',
    type: 'SCIENTIFIC',
    team: 'Research Group Alpha (NCPOR Glaciology)',
    leader: 'Dr. Priya Sharma',
    status: 'PLANNED',
    departureDate: '18 Sept 2026, 06:00 UTC',
    duration: '2 Days',
    riskScore: 62
  },
  {
    id: 'EXP-022',
    title: 'Amery Deep Seismic Exploration Traverse',
    stationId: 'BHARATI',
    routeId: 'B-03',
    type: 'RESEARCH',
    team: 'National Polar Seismic Taskforce',
    leader: 'Dr. Rajesh Nair',
    status: 'ACTIVE',
    departureDate: '14 Sept 2026, 08:30 UTC',
    duration: '5 Days',
    riskScore: 34
  },
  {
    id: 'EXP-023',
    title: 'Polar Plateau Winter Fuel Resupply Convoy',
    stationId: 'MAITRI',
    routeId: 'M-02',
    type: 'LOGISTICS',
    team: 'Maitri Heavy Convoy Brigade',
    leader: 'Cmdr. Vikram Singh (Retd.)',
    status: 'REVIEW',
    departureDate: '19 Sept 2026, 04:00 UTC',
    duration: '1 Day',
    riskScore: 71
  },
  {
    id: 'EXP-024',
    title: 'Prydz Bay Sea-Ice Core & Ecological Audit',
    stationId: 'BHARATI',
    routeId: 'B-01',
    type: 'RESEARCH',
    team: 'Marine Ecosystem & Cryosphere Unit',
    leader: 'Dr. Ananya Roy',
    status: 'ACTIVE',
    departureDate: '15 Sept 2026, 09:00 UTC',
    duration: '3 Days',
    riskScore: 58
  }
];

// GET /api/expeditions
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: EXPEDITIONS_DATA.length,
    expeditions: EXPEDITIONS_DATA
  });
});

// GET /api/expeditions/routes
router.get('/routes', (req, res) => {
  res.json({
    success: true,
    count: ROUTE_DATA.length,
    routes: ROUTE_DATA
  });
});

// GET /api/expeditions/routes/:id
router.get('/routes/:id', (req, res) => {
  const route = ROUTE_DATA.find(r => r.id === req.params.id || r.code === req.params.id);
  if (!route) {
    return res.status(404).json({ success: false, message: 'Route corridor not found' });
  }
  res.json({
    success: true,
    route
  });
});

// POST /api/expeditions/routes/:id/decision
router.post('/routes/:id/decision', async (req, res) => {
  const { action, note, operatorName } = req.body;
  const route = ROUTE_DATA.find(r => r.id === req.params.id || r.code === req.params.id);
  if (!route) {
    return res.status(404).json({ success: false, message: 'Route corridor not found' });
  }

  // Audit log entry in MongoDB
  try {
    await AuditLog.create({
      action: 'EXPEDITION_ROUTE_DECISION',
      performedBy: operatorName || 'Mission Controller',
      userEmail: 'operator@antarctic.gov.in',
      role: 'ADMIN',
      target: `Route Corridor ${route.code}`,
      station: route.stationId,
      details: `Operator decision "${action}" recorded. Note: ${note || 'None'}`
    });
  } catch (err) {
    console.error('AuditLog error:', err.message);
  }

  res.json({
    success: true,
    message: `Decision "${action}" processed successfully for ${route.code}`,
    route
  });
});

export default router;
