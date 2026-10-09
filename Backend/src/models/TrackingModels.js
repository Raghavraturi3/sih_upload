// Mongoose Data Models for Polar Maritime & Aviation Tracking
import mongoose from 'mongoose';

// ── Vessel Schema ──
const VesselSchema = new mongoose.Schema({
  mmsi: { type: String, required: true, unique: true },
  imo: { type: String },
  name: { type: String, required: true },
  vesselType: { type: String, default: 'CARGO' },
  flag: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speedKnots: { type: Number, default: 0 },
  course: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  navigationStatus: { type: String, default: 'Underway' },
  destination: { type: String },
  departurePort: { type: String },
  eta: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  dataSource: { type: String, default: 'AIS' },
  trackingStatus: { type: String, enum: ['LIVE', 'STALE', 'OFFLINE'], default: 'LIVE' },
  associatedShipmentId: { type: String }
}, { timestamps: true });

// ── Aircraft Schema ──
const AircraftSchema = new mongoose.Schema({
  icao24: { type: String, required: true, unique: true },
  callsign: { type: String },
  registration: { type: String },
  model: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitude: { type: Number, default: 0 },
  velocity: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  verticalRate: { type: Number, default: 0 },
  originCountry: { type: String },
  origin: { type: String },
  destination: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  dataSource: { type: String, default: 'ADS-B' },
  trackingStatus: { type: String, enum: ['LIVE', 'STALE', 'OFFLINE'], default: 'LIVE' },
  associatedShipmentId: { type: String }
}, { timestamps: true });

// ── Shipment Schema ──
const ShipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  items: [{
    name: String,
    quantity: Number,
    unit: String
  }],
  vesselMmsi: { type: String },
  aircraftIcao: { type: String },
  transportType: { type: String, enum: ['VESSEL', 'AIRCRAFT'], default: 'VESSEL' },
  carrierName: { type: String },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, default: 'IN_TRANSIT' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  eta: { type: String },
  loadingDate: { type: String },
  progressPercent: { type: Number, default: 0 }
}, { timestamps: true });

export const VesselModel = mongoose.model('TrackingVessel', VesselSchema);
export const AircraftModel = mongoose.model('TrackingAircraft', AircraftSchema);
export const ShipmentModel = mongoose.model('TrackingShipment', ShipmentSchema);
