import mongoose from 'mongoose';

const LogisticsSchema = new mongoose.Schema({
  logisticsId: { type: String, required: true, unique: true },
  vehicle: { type: String, required: true },
  type: { type: String, enum: ['AIRFLIGHT', 'ICEBREAKER', 'OVERLAND', 'SUBMERSIBLE'], default: 'AIRFLIGHT' },
  cargo: { type: String, required: true },
  origin: { type: String, default: 'Base Station' },
  ETA: { type: String, default: 'Unknown' },
  status: { type: String, enum: ['IN_FLIGHT', 'EN_ROUTE', 'ARRIVING', 'DOCKED', 'DELAYED'], default: 'EN_ROUTE' },
  tempMonitored: { type: Boolean, default: false }
}, { timestamps: true });

export const Logistics = mongoose.model('Logistics', LogisticsSchema);
