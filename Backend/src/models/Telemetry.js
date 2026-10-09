import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  name: { type: String, default: 'Amundsen-Scott Base Alpha' },
  code: { type: String, default: 'ASB-01' },
  latitude: { type: String, default: '-90.0000° S' },
  longitude: { type: String, default: '0.0000° E' },
  elevation: { type: String, default: '2,835m' },
  status: { type: String, default: 'OPERATIONAL' },
  latency: { type: Number, default: 18 },
  syncQuality: { type: Number, default: 100 }
}, { _id: false });

const KPISchema = new mongoose.Schema({
  powerKw: { type: Number, default: 142.8 },
  powerCapacityKw: { type: Number, default: 180.0 },
  tempAmbient: { type: Number, default: -34.2 },
  windChill: { type: Number, default: -48.5 },
  windSpeedKnots: { type: Number, default: 42 },
  activePersonnel: { type: Number, default: 48 },
  totalCapacity: { type: Number, default: 60 },
  activeAlertsCount: { type: Number, default: 3 },
  solarOutputKw: { type: Number, default: 48.2 },
  windOutputKw: { type: Number, default: 74.6 },
  batteryChargePercent: { type: Number, default: 94 }
}, { _id: false });

const TelemetrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  station: { type: StationSchema, default: () => ({}) },
  kpis: { type: KPISchema, default: () => ({}) }
}, { timestamps: true });

export const Telemetry = mongoose.model('Telemetry', TelemetrySchema);
