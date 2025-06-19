const Student = require('../models/Student');

exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

exports.updateHandle = async (req, res) => {
  const { id } = req.params;
  const { cfHandle } = req.body;

  const student = await Student.findById(id);
  if (!student) return res.status(404).json({ message: 'Student not found' });

  student.cfHandle = cfHandle;
  await student.save();

  res.json({ message: 'Handle updated' });
};
