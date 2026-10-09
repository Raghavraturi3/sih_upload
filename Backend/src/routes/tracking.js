// Backend REST API Router — Polar Maritime & Aviation Live Tracking
import express from 'express';
import { AuditLog } from '../models/AuditLog.js';

const router = express.Router();

// Fallback in-memory tracking dataset for immediate high-performance serving
const BACKEND_VESSELS = [
  {
    mmsi: '273456890',
    imo: '8603406',
    name: 'MV Vasiliy Golovnin',
    vesselType: 'ICEBREAKER',
    flag: 'Russia (Indian Expedition Charter)',
    latitude: -61.4200,
    longitude: 13.1000,
    speedKnots: 13.2,
    course: 182,
    heading: 180,
    navigationStatus: 'Underway Using Engine',
    destination: 'Maitri Station',
    departurePort: 'Cape Town Gateway',
    eta: '21 Sep 2026 • 11:00 UTC',
    lastUpdated: '12 sec ago',
    dataSource: 'AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-LOG-2026-0182'
  },
  {
    mmsi: '273111220',
    imo: '8813908',
    name: 'MV Ivan Papanin',
    vesselType: 'CARGO',
    flag: 'India (Charter)',
    latitude: -18.2500,
    longitude: 51.6000,
    speedKnots: 14.5,
    course: 228,
    heading: 226,
    navigationStatus: 'Underway Using Engine',
    destination: 'Cape Town Gateway',
    departurePort: 'Mormugao Port (Goa)',
    eta: '25 Sep 2026 • 16:30 UTC',
    lastUpdated: '25 sec ago',
    dataSource: 'AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-SPARE-2026-0112'
  },
  {
    mmsi: '419000180',
    imo: '9120034',
    name: 'INS Sagardhwani',
    vesselType: 'RESEARCH',
    flag: 'India (Indian Navy / DRDO)',
    latitude: -56.8000,
    longitude: 54.2000,
    speedKnots: 10.4,
    course: 165,
    heading: 162,
    navigationStatus: 'Engaged in Oceanographic Survey',
    destination: 'Bharati Station',
    departurePort: 'Cape Town Gateway',
    eta: '23 Sep 2026 • 08:00 UTC',
    lastUpdated: '8 sec ago',
    dataSource: 'AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-SCI-2026-0094'
  },
  {
    mmsi: '636018992',
    imo: '9345511',
    name: 'MT Polar Pride',
    vesselType: 'TANKER',
    flag: 'Liberia (Charter)',
    latitude: -48.1000,
    longitude: 16.4000,
    speedKnots: 11.8,
    course: 184,
    heading: 185,
    navigationStatus: 'Underway Using Engine',
    destination: 'Maitri Fuel Cache',
    departurePort: 'Cape Town Gateway',
    eta: '24 Sep 2026 • 14:00 UTC',
    lastUpdated: '40 sec ago',
    dataSource: 'AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-FUEL-2026-0440'
  },
  {
    mmsi: '257002340',
    imo: '9481234',
    name: 'MV Antarctic Explorer',
    vesselType: 'SUPPLY',
    flag: 'Norway / India Joint Ops',
    latitude: -63.5000,
    longitude: 68.8000,
    speedKnots: 12.6,
    course: 148,
    heading: 147,
    navigationStatus: 'Underway in Sea Ice Margin',
    destination: 'Bharati Station',
    departurePort: 'Cape Town Gateway',
    eta: '19 Sep 2026 • 18:00 UTC',
    lastUpdated: '18 sec ago',
    dataSource: 'AIS',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-FOOD-2026-0205'
  }
];

const BACKEND_AIRCRAFT = [
  {
    icao24: '15408C',
    callsign: 'DROMLAN-1',
    registration: 'RA-76952',
    model: 'Ilyushin IL-76TD-90VD',
    latitude: -52.4000,
    longitude: 14.8000,
    altitude: 31000,
    velocity: 440,
    heading: 186,
    verticalRate: 0,
    originCountry: 'South Africa / DROMLAN',
    origin: 'Cape Town International (CPT)',
    destination: 'Novo Blue Ice Runway (Maitri)',
    lastUpdated: '6 sec ago',
    dataSource: 'ADS-B',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-AIR-2026-0012'
  },
  {
    icao24: 'C02A8B',
    callsign: 'KENBORE-04',
    registration: 'C-GEAJ',
    model: 'Basler BT-67 (Turbo DC-3 Ski)',
    latitude: -70.1500,
    longitude: 42.6000,
    altitude: 12500,
    velocity: 195,
    heading: 88,
    verticalRate: 150,
    originCountry: 'Canada (Kenn Borek Air)',
    origin: 'Maitri Station Air Strip',
    destination: 'Bharati Station',
    lastUpdated: '4 sec ago',
    dataSource: 'ADS-B',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-MED-2026-0031'
  },
  {
    icao24: 'A1B2C3',
    callsign: 'POLAR-2',
    registration: 'VP-FAZ',
    model: 'DHC-6 Twin Otter Ski',
    latitude: -69.2000,
    longitude: 74.5000,
    altitude: 4800,
    velocity: 142,
    heading: 260,
    verticalRate: 0,
    originCountry: 'United Kingdom (BAS Logistics)',
    origin: 'Amery Ice Shelf Camp',
    destination: 'Bharati Station',
    lastUpdated: '14 sec ago',
    dataSource: 'ADS-B',
    trackingStatus: 'LIVE',
    associatedShipmentId: 'ANT-RAD-2026-0088'
  }
];

const BACKEND_SHIPMENTS = [
  {
    shipmentId: 'ANT-LOG-2026-0182',
    title: 'Maitri Polar Diesel & Drilling Payload',
    category: 'Fuel',
    items: [
      { name: 'Arctic Diesel Fuel', quantity: 120000, unit: 'Liters' },
      { name: 'Drilling Rig Spares', quantity: 18, unit: 'Crates' }
    ],
    vesselMmsi: '273456890',
    transportType: 'VESSEL',
    carrierName: 'MV Vasiliy Golovnin',
    origin: 'Cape Town Gateway',
    destination: 'Maitri Station',
    status: 'IN_TRANSIT',
    priority: 'HIGH',
    eta: '21 Sep 2026 • 11:00 UTC',
    loadingDate: '10 Sep 2026',
    progressPercent: 68
  },
  {
    shipmentId: 'ANT-MED-2026-0031',
    title: 'Emergency Medical Serum & Defibrillators',
    category: 'Medical',
    items: [
      { name: 'Blood Plasma & Anti-Frostbite Serum', quantity: 50, unit: 'Vials' },
      { name: 'Automated External Defibrillators', quantity: 4, unit: 'Units' }
    ],
    vesselMmsi: null,
    aircraftIcao: 'C02A8B',
    transportType: 'AIRCRAFT',
    carrierName: 'Basler BT-67 (KENBORE-04)',
    origin: 'Maitri Station Air Strip',
    destination: 'Bharati Station',
    status: 'IN_FLIGHT',
    priority: 'CRITICAL',
    eta: 'Today • 15:45 UTC',
    loadingDate: '17 Sep 2026',
    progressPercent: 55
  }
];

// GET /api/tracking/vessels
router.get('/vessels', (req, res) => {
  res.json({
    success: true,
    count: BACKEND_VESSELS.length,
    data: BACKEND_VESSELS
  });
});

// GET /api/tracking/vessels/:mmsi
router.get('/vessels/:mmsi', (req, res) => {
  const v = BACKEND_VESSELS.find(item => item.mmsi === req.params.mmsi);
  if (!v) return res.status(404).json({ success: false, message: 'Vessel not found' });
  res.json({ success: true, data: v });
});

// GET /api/tracking/aircraft
router.get('/aircraft', (req, res) => {
  res.json({
    success: true,
    count: BACKEND_AIRCRAFT.length,
    data: BACKEND_AIRCRAFT
  });
});

// GET /api/tracking/shipments
router.get('/shipments', (req, res) => {
  res.json({
    success: true,
    count: BACKEND_SHIPMENTS.length,
    data: BACKEND_SHIPMENTS
  });
});

// GET /api/tracking/shipments/:id
router.get('/shipments/:id', (req, res) => {
  const sh = BACKEND_SHIPMENTS.find(item => item.shipmentId === req.params.id);
  if (!sh) return res.status(404).json({ success: false, message: 'Shipment not found' });
  res.json({ success: true, data: sh });
});

// GET /api/tracking/stations
router.get('/stations', (req, res) => {
  res.json({
    success: true,
    stations: [
      { id: 'MAITRI', name: 'Maitri Station', lat: -70.7658, lon: 11.7358, status: 'OPERATIONAL' },
      { id: 'BHARATI', name: 'Bharati Station', lat: -69.4078, lon: 76.1872, status: 'OPERATIONAL' }
    ]
  });
});

// GET /api/tracking/ports
router.get('/ports', (req, res) => {
  res.json({
    success: true,
    ports: [
      { id: 'PORT_CAPE_TOWN', name: 'Cape Town Logistics Gateway', lat: -33.9249, lon: 18.4241 },
      { id: 'PORT_MORMUGAO', name: 'Mormugao Port (Goa)', lat: 15.4026, lon: 73.8055 }
    ]
  });
});

// POST /api/tracking/audit
router.post('/audit', async (req, res) => {
  const { action, objectId, details, userEmail } = req.body;
  try {
    await AuditLog.create({
      action: action || 'VIEW_TRACKING_OBJECT',
      performedBy: userEmail || 'Operator',
      userEmail: userEmail || 'operator@antarctic.gov.in',
      role: 'LOGISTICS',
      target: objectId || 'Polar Tracking Map',
      station: 'MAITRI',
      details: details || 'Operational tracking map query'
    });
  } catch (err) {
    console.error('AuditLog error:', err.message);
  }
  res.json({ success: true });
});

export default router;
export { BACKEND_VESSELS, BACKEND_AIRCRAFT };
