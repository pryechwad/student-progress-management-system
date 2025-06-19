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
  cfHandle: {
    type: String,
    required: true,
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
  // How many inactivity reminder emails sent so far
  inactivityRemindersSent: {
    type: Number,
    default: 0
  },
  // If true, don't send auto inactivity emails for this student
  disableAutoEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('Student', studentSchema);
