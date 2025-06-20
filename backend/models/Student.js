const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // optional, helps avoid duplicates
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  cfHandle: {
    type: String,
    required: false,
    trim: true
  },
  currentRating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  lastSyncedAt: {
    type: Date,
    default: null
  },
  lastCFUpdate: {
    type: Date,
    default: null
  },
  inactivityRemindersSent: {
    type: Number,
    default: 0
  },
  disableAutoEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
