const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { pool } = require('../config/db');

const router = express.Router();

const allowedRoles = [
  'administrator',
  'farmer',
  'tea-inspector',
  'field-officer',
  'factory-officer',
  'leaf-collector',
];

function createToken(user) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured in the environment.');
  }

  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' },
  );
}

function publicUser(user) {
  const {
    password_hash: passwordHash,
    full_name: fullName,
    inspector_id: inspectorId,
    employee_id: employeeId,
    created_at: createdAt,
    updated_at: updatedAt,
    ...userData
  } = user;

  return {
    ...userData,
    fullName,
    inspectorId,
    employeeId,
    createdAt,
    updatedAt,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      nic,
      mobile,
      address,
      organization,
      district,
      designation,
      inspectorId,
      employeeId,
      factory,
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, password, and role are required.',
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role.',
      });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUserResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail],
    );

    if (existingUserResult.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await pool.query(
      `INSERT INTO users (
        full_name, email, password_hash, role, nic, mobile, address,
        organization, district, designation, inspector_id, employee_id, factory
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        fullName,
        normalizedEmail,
        passwordHash,
        role,
        nic || null,
        mobile || null,
        address || null,
        organization || null,
        district || null,
        designation || null,
        inspectorId || null,
        employeeId || null,
        factory || null,
      ],
    );
    const user = userResult.rows[0];

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'An account with one of these unique fields already exists.',
      });
    }

    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.trim().toLowerCase()],
    );
    const user = userResult.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.status === 'suspended' || user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: `This account is ${user.status}.`,
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
