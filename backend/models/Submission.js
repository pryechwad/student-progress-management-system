const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submissionId: {
    type: Number,
    required: true,
    unique: true
  },
  contestId: Number,
  problemIndex: String,
  problemName: String,
  problemRating: Number,
  verdict: String,
  creationTimeSeconds: Number,
  programmingLanguage: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);