const axios = require('axios');
const Student = require('../models/Student');
const Submission = require('../models/Submission');

exports.syncStudentCF = async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);
  if (!student || !student.cfHandle) {
    return res.status(404).json({ message: 'Student or CF handle not found' });
  }

  const { data } = await axios.get(`https://codeforces.com/api/user.status?handle=${student.cfHandle}`);

  await Submission.deleteMany({ student: student._id });

  const subs = data.result.map(s => ({
    student: student._id,
    problem: s.problem,
    verdict: s.verdict,
    date: new Date(s.creationTimeSeconds * 1000)
  }));

  await Submission.insertMany(subs);

  const rated = data.result.filter(s => s.verdict === 'OK' && s.problem.rating);
  const ratings = rated.map(s => s.problem.rating);
  const current = ratings.length ? ratings[ratings.length - 1] : student.currentRating;
  const maxR = ratings.length ? Math.max(...ratings) : student.maxRating;

  student.currentRating = current;
  student.maxRating = maxR;
  student.lastSyncedAt = new Date();
  await student.save();

  res.json({ message: 'Synced successfully', current, maxR });
};
