const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

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
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' },
  );
}

function publicUser(user) {
  const userData = user.toObject();
  delete userData.passwordHash;
  return userData;
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
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      passwordHash,
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
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
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

    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
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
