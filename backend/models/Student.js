const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  cfHandle: String,
  currentRating: Number,
  maxRating: Number,
  lastSyncedAt: Date,
  inactivityRemindersSent: { type: Number, default: 0 },
  disableAutoEmail: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);
