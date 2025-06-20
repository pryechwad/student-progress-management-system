const Student = require('../models/Student');
const axios = require('axios');

// 🔑 Reusable helper: fetch Codeforces profile info
const fetchCodeforcesInfo = async (handle) => {
  const { data } = await axios.get(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const info = data.result[0];
  return {
    currentRating: info.rating || 0,
    maxRating: info.maxRating || 0,
    lastCFUpdate: new Date(),
  };
};

// ➤ ADD Student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, codeforcesHandle } = req.body;

    const student = new Student({
      name,
      email,
      codeforcesHandle,
    });

    // ✅ If handle is provided, fetch CF data immediately
    if (codeforcesHandle) {
      const cfData = await fetchCodeforcesInfo(codeforcesHandle);
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.lastCFUpdate = cfData.lastCFUpdate;
    }

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ➤ UPDATE Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student not found' });

    const { name, email, codeforcesHandle } = req.body;

    student.name = name || student.name;
    student.email = email || student.email;

    // ✅ If handle changed, refetch CF data
    if (codeforcesHandle && codeforcesHandle !== student.codeforcesHandle) {
      student.codeforcesHandle = codeforcesHandle;
      const cfData = await fetchCodeforcesInfo(codeforcesHandle);
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.lastCFUpdate = cfData.lastCFUpdate;
    }

    await student.save();
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
