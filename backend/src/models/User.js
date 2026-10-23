const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 100,
    },
    nic: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    mobile: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['administrator', 'farmer', 'tea-inspector', 'factory-officer', 'leaf-collector'],
      required: [true, 'User role is required'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    district: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    inspectorId: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true,
    },
    employeeId: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true,
    },
    factory: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
