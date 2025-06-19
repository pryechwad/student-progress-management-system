const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  problem: Object,
  verdict: String,
  date: Date
});

module.exports = mongoose.model('Submission', submissionSchema);
