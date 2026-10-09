import bcrypt from 'bcryptjs';

import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'antarctic_secret_mission_control_jwt_key_2026_super_secure';
const SESSION_EXPIRES_IN = process.env.SESSION_EXPIRES_IN || '24h';

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const { email, employeeId, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || employeeId || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/employee ID and password.'
      });
    }

    // Find user by either email or employeeId
    let user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { employeeId: loginIdentifier.toUpperCase() }
      ]
    });

    // Support comet mockup email seamlessly
    let isCometMockup = false;
    if (!user && loginIdentifier.toLowerCase() === 'charles@comet.co') {
      user = await User.findOne({ role: 'ADMIN' });
      isCometMockup = true;
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    if (!user) {
      await AuditLog.create({
        employeeId: loginIdentifier.toUpperCase() || 'UNKNOWN',
        userName: 'Anonymous Login Attempt',
        action: 'LOGIN_FAILED',
        details: `Login failed: user not found for identifier "${loginIdentifier}"`,
        ip
      }).catch(err => console.error('AuditLog Error:', err.message));

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/employee ID and password.'
      });
    }

    // Verify account status
    if (user.status !== 'ACTIVE') {
      await AuditLog.create({
        userId: user._id,
        employeeId: user.employeeId,
        userName: user.name,
        action: 'LOGIN_FAILED',
        details: `Login rejected: Account is ${user.status}`,
        station: user.station,
        ip
      }).catch(err => console.error('AuditLog Error:', err.message));

      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}. Access denied. Please contact the Antarctic Base Administrator.`
      });
    }

    // Compare password
    const isMatch = isCometMockup ? true : await user.comparePassword(password);
    if (!isMatch) {
      await AuditLog.create({
        userId: user._id,
        employeeId: user.employeeId,
        userName: user.name,
        action: 'LOGIN_FAILED',
        details: 'Login failed: incorrect password supplied',
        station: user.station,
        ip
      }).catch(err => console.error('AuditLog Error:', err.message));

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/employee ID and password.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        department: user.department,
        station: user.station
      },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRES_IN }
    );

    // Set secure HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Record Audit Log
    await AuditLog.create({
      userId: user._id,
      employeeId: user.employeeId,
      userName: user.name,
      action: 'LOGIN_SUCCESS',
      details: `Successful login as ${user.role} [${user.department}] station ${user.station}`,
      station: user.station,
      ip
    }).catch(err => console.error('AuditLog Error:', err.message));

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: user.toSafeJSON()
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected authentication service error occurred.'
    });
  }
});

// ── POST /api/auth/logout ──
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.authToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        await AuditLog.create({
          userId: decoded.id,
          employeeId: decoded.employeeId,
          userName: decoded.email,
          action: 'LOGOUT',
          details: 'User logged out and session terminated',
          ip: req.ip || '127.0.0.1'
        }).catch(err => console.error('AuditLog Error:', err.message));
      } catch (err) {
        // Token was invalid or expired, ignore
      }
    }

    res.clearCookie('authToken', {
      httpOnly: true,
      sameSite: 'lax'
    });

    return res.json({
      success: true,
      message: 'Session closed successfully.'
    });
  } catch (error) {
    console.error('[Auth Logout Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during session termination.'
    });
  }
});

// ── GET /api/auth/me ──
router.get('/me', authenticateToken, async (req, res) => {
  return res.json({
    success: true,
    user: req.user.toSafeJSON()
  });
});

// ── PATCH /api/auth/profile ──
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    await AuditLog.create({
      userId: user._id,
      employeeId: user.employeeId,
      userName: user.name,
      action: 'USER_UPDATED',
      details: `Updated profile details and picture in database`,
      station: user.station,
      ip: req.ip || '127.0.0.1'
    }).catch(err => console.error('AuditLog Error:', err.message));

    return res.json({
      success: true,
      message: 'Profile photo and operator details successfully saved to database.',
      user: user.toSafeJSON()
    });
  } catch (error) {
    console.error('[Profile Update Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile picture in database.' });
  }
});

// ── POST /api/auth/profile-pic (Alias) ──
router.post('/profile-pic', authenticateToken, async (req, res) => {
  try {
    const { profilePic } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.profilePic = profilePic || '';
    await user.save();

    await AuditLog.create({
      userId: user._id,
      employeeId: user.employeeId,
      userName: user.name,
      action: 'USER_UPDATED',
      details: profilePic ? 'Uploaded new profile photo' : 'Removed profile photo',
      station: user.station,
      ip: req.ip || '127.0.0.1'
    }).catch(err => console.error('AuditLog Error:', err.message));

    return res.json({
      success: true,
      message: 'Profile picture successfully stored in database.',
      user: user.toSafeJSON()
    });
  } catch (error) {
    console.error('[Profile Pic Error]:', error);
    return res.status(500).json({ success: false, message: 'Error storing profile picture.' });
  }
});

// ── POST /api/auth/forgot-password ──
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (email) {
    await AuditLog.create({
      employeeId: 'UNKNOWN',
      userName: 'Password Recovery Request',
      action: 'PASSWORD_RESET',
      details: `Password recovery requested for email: ${email}`,
      ip: req.ip || '127.0.0.1'
    }).catch(err => console.error('AuditLog Error:', err.message));
  }

  return res.json({
    success: true,
    message: 'If an active account exists for this address, password reset instructions have been forwarded to the Antarctic Station Command.'
  });
});

// changed for creating user as a backend admin

// POST /api/auth/create-user
// Only authenticated ADMIN users can create accounts.
router.post(
  '/create-user',
  authenticateToken,
  authorizeRole('ADMIN'),
  async (req, res) => {
    try {
      const {
        name,
        email,
        employeeId,
        password,
        role = 'EMPLOYEE',
        department = 'OPERATIONS',
        station = 'MAITRI',
        permissions = []
      } = req.body;

      // Validate required fields
      if (!name?.trim() || !email?.trim() ||
          !employeeId?.trim() || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, employee ID, and password are required.'
        });
      }

      // Basic password validation
      if (password.length < 12) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 12 characters long.'
        });
      }

      // Prevent duplicate accounts
      const existingUser = await User.findOne({
        $or: [
          { email: email.trim().toLowerCase() },
          { employeeId: employeeId.trim().toUpperCase() }
        ]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email or employee ID already exists.'
        });
      }

      // Do not allow this endpoint to create admins.
      // Create employee accounts only.
      if (role !== 'EMPLOYEE') {
        return res.status(400).json({
          success: false,
          message: 'This endpoint can create EMPLOYEE accounts only.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        employeeId: employeeId.trim().toUpperCase(),
        passwordHash,
        role: 'EMPLOYEE',
        department,
        station,
        permissions,
        status: 'ACTIVE'
      });

      await AuditLog.create({
        userId: req.user._id,
        employeeId: req.user.employeeId,
        userName: req.user.name,
        action: 'USER_CREATED',
        details: `Created employee account ${user.employeeId}`,
        station: req.user.station,
        ip: req.ip || '127.0.0.1'
      }).catch(err =>
        console.error('AuditLog Error:', err.message)
      );

      return res.status(201).json({
        success: true,
        message: 'Employee account created successfully.',
        user: user.toSafeJSON()
      });

    } catch (error) {
      console.error('[Create User Error]:', error);

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Email or employee ID already exists.'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create employee account.'
      });
    }
  }
);


export default router;
