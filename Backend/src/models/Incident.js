import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW', 'CRITICAL'], default: 'MEDIUM' },
  sector: { type: String, required: true },
  timestamp: { type: String, default: 'Just now' },
  status: { 
    type: String, 
    enum: ['INVESTIGATING', 'IN_PROGRESS', 'MONITORING', 'RESOLVED'], 
    default: 'INVESTIGATING' 
  },
  assignee: { type: String, default: 'Unassigned' },
  description: { type: String, default: '' }
}, { timestamps: true });

export const Incident = mongoose.model('Incident', IncidentSchema);
