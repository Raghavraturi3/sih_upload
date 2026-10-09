import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  employeeId: {
    type: String,
    default: 'SYSTEM'
  },
  userName: {
    type: String,
    default: 'System Operator'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_STATUS_CHANGED',
      'PASSWORD_RESET',
      'ACCESS_DENIED',
      'TELEMETRY_OVERRIDE',
      'INCIDENT_REPORTED'
    ]
  },
  details: {
    type: String,
    default: ''
  },
  station: {
    type: String,
    default: 'MAITRI'
  },
  ip: {
    type: String,
    default: '127.0.0.1'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
