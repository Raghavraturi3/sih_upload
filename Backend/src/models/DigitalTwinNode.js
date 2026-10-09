import mongoose from 'mongoose';

const DigitalTwinNodeSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['HABITATION', 'POWER', 'ENERGY', 'RESEARCH', 'AGRICULTURE', 'COMMUNICATIONS', 'OTHER'],
    default: 'HABITATION' 
  },
  temp: { type: Number, default: 20 },
  pressure: { type: Number, default: 101.3 },
  o2Level: { type: Number, default: 20.9 },
  status: { type: String, enum: ['NORMAL', 'WARNING', 'CRITICAL', 'OFFLINE'], default: 'NORMAL' },
  load: { type: Number, default: 50 },
  x: { type: Number, default: 200 },
  y: { type: Number, default: 200 }
}, { timestamps: true });

export const DigitalTwinNode = mongoose.model('DigitalTwinNode', DigitalTwinNodeSchema);
