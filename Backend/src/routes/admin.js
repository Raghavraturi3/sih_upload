import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticateToken);
router.use(authorizeRole('ADMIN'));

// ── GET /api/admin/users ──
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => u.toSafeJSON())
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/admin/users ──
router.post('/users', async (req, res) => {
  try {
    const {
      name,
      employeeId,
      email,
      password,
      role = 'EMPLOYEE',
      department = 'OPERATIONS',
      station = 'MAITRI',
      permissions = [],
      status = 'ACTIVE'
    } = req.body;

    if (!name || !employeeId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, Employee ID, Email, and Temporary Password are required.'
      });
    }

    // Check duplicate email or employeeId
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `User with email "${email}" already exists.`
      });
    }

    const existingEmp = await User.findOne({ employeeId: employeeId.toUpperCase().trim() });
    if (existingEmp) {
      return res.status(400).json({
        success: false,
        message: `User with Employee ID "${employeeId}" already exists.`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      employeeId: employeeId.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      department,
      station,
      permissions,
      status
    });

    await AuditLog.create({
      userId: req.user._id,
      employeeId: req.user.employeeId,
      userName: req.user.name,
      action: 'USER_CREATED',
      details: `Created new user ${newUser.name} (${newUser.employeeId}) with role ${newUser.role} [${newUser.department}]`,
      station: req.user.station,
      ip: req.ip || '127.0.0.1'
    });

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully.',
      user: newUser.toSafeJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── PATCH /api/admin/users/:id ──
router.patch('/users/:id', async (req, res) => {
  try {
    const { name, role, department, station, permissions, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const changes = [];
    if (name && name !== user.name) {
      changes.push(`name: "${user.name}" -> "${name}"`);
      user.name = name.trim();
    }
    if (role && role !== user.role) {
      changes.push(`role: "${user.role}" -> "${role}"`);
      user.role = role;
    }
    if (department && department !== user.department) {
      changes.push(`dept: "${user.department}" -> "${department}"`);
      user.department = department;
    }
    if (station && station !== user.station) {
      changes.push(`station: "${user.station}" -> "${station}"`);
      user.station = station;
    }
    if (permissions && Array.isArray(permissions)) {
      changes.push(`permissions updated`);
      user.permissions = permissions;
    }
    if (status && status !== user.status) {
      changes.push(`status: "${user.status}" -> "${status}"`);
      user.status = status;
    }

    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      employeeId: req.user.employeeId,
      userName: req.user.name,
      action: status ? 'USER_STATUS_CHANGED' : 'USER_UPDATED',
      details: `Updated user ${user.employeeId}: ${changes.join(', ')}`,
      station: req.user.station,
      ip: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: 'User updated successfully.',
      user: user.toSafeJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/admin/users/:id/reset-password ──
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    await AuditLog.create({
      userId: req.user._id,
      employeeId: req.user.employeeId,
      userName: req.user.name,
      action: 'PASSWORD_RESET',
      details: `Administrator reset password for user ${user.employeeId} (${user.email})`,
      station: req.user.station,
      ip: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: `Password reset successfully for ${user.name} (${user.employeeId}).`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/audit-logs ──
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
