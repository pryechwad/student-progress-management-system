const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  contestId: {
    type: Number,
    required: true
  },
  contestName: String,
  rank: Number,
  oldRating: Number,
  newRating: Number,
  ratingChange: Number,
  participationTimeSeconds: Number,
  problemsSolved: Number,
  totalProblems: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Contest', contestSchema);