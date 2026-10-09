import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    // 2. Check Authorization Bearer header
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.'
      });
    }

    const secret = process.env.JWT_SECRET || 'antarctic_secret_mission_control_jwt_key_2026_super_secure';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please sign in again.'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}. Access denied. Please contact base administrator.`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal security authentication error.'
    });
  }
}

// Check role(s)
export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      AuditLog.create({
        userId: req.user._id,
        employeeId: req.user.employeeId,
        userName: req.user.name,
        action: 'ACCESS_DENIED',
        details: `Unauthorized role attempt for ${req.method} ${req.originalUrl}. Required: [${allowedRoles.join(', ')}], User: ${req.user.role}`,
        station: req.user.station,
        ip: req.ip || '127.0.0.1'
      }).catch(err => console.error('AuditLog Error:', err.message));

      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have sufficient role clearance to access this resource.'
      });
    }

    next();
  };
}

// Check department(s) - Admin bypasses
export function authorizeDepartment(...allowedDepartments) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role === 'ADMIN' || req.user.department === 'ALL') {
      return next();
    }

    if (!allowedDepartments.includes(req.user.department)) {
      AuditLog.create({
        userId: req.user._id,
        employeeId: req.user.employeeId,
        userName: req.user.name,
        action: 'ACCESS_DENIED',
        details: `Department restriction for ${req.method} ${req.originalUrl}. Required: [${allowedDepartments.join(', ')}], User: ${req.user.department}`,
        station: req.user.station,
        ip: req.ip || '127.0.0.1'
      }).catch(err => console.error('AuditLog Error:', err.message));

      return res.status(403).json({
        success: false,
        message: `Forbidden. This operational module is restricted to the [${allowedDepartments.join(', ')}] department.`
      });
    }

    next();
  };
}

// Check specific permission(s) - Admin bypasses
export function authorizePermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role === 'ADMIN' || (req.user.permissions && req.user.permissions.includes('admin.all'))) {
      return next();
    }

    const hasPerm = requiredPermissions.some(perm => req.user.permissions.includes(perm));
    if (!hasPerm) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Missing specific functional permission key.'
      });
    }

    next();
  };
}
