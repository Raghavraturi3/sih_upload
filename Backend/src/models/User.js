import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'EMPLOYEE'],
    default: 'EMPLOYEE'
  },
  department: {
    type: String,
    enum: [
      'INFRASTRUCTURE',
      'ENERGY',
      'LOGISTICS',
      'ENVIRONMENT',
      'RESEARCH',
      'MEDICAL',
      'COMMUNICATION',
      'OPERATIONS',
      'ALL'
    ],
    default: 'OPERATIONS'
  },
  station: {
    type: String,
    enum: ['MAITRI', 'BHARATI', 'ALL'],
    default: 'MAITRI'
  },
  permissions: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  profilePic: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Return safe user object stripped of passwordHash
UserSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    employeeId: this.employeeId,
    name: this.name,
    email: this.email,
    profilePic: this.profilePic || '',
    role: this.role,
    department: this.department,
    station: this.station,
    permissions: this.permissions,
    status: this.status,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const User = mongoose.model('User', UserSchema);
