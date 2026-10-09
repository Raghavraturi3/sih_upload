import mongoose from 'mongoose';

const PersonnelSchema = new mongoose.Schema({
  personnelId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  sector: { type: String, required: true },
  duty: { type: String, enum: ['ON_DUTY', 'ON_CALL', 'RESTING', 'OFF_STATION'], default: 'ON_DUTY' },
  medical: { type: String, enum: ['CLEARED', 'RESTRICTED', 'EVALUATION'], default: 'CLEARED' },
  contact: { type: String, default: 'Sat-Ext #100' }
}, { timestamps: true });

export const Personnel = mongoose.model('Personnel', PersonnelSchema);
