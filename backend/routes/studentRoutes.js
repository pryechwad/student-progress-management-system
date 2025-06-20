const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const axios = require('axios');

// ✅ Helper
const fetchCodeforcesInfo = async (handle) => {
  const { data } = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
  const info = data.result[0];
  return {
    currentRating: info.rating || 0,
    maxRating: info.maxRating || 0,
    lastCFUpdate: new Date(),
  };
};

// ✅ CREATE
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle, currentRating, maxRating } = req.body;
    const student = new Student({ 
      name, 
      email, 
      phone, 
      cfHandle: codeforcesHandle,
      currentRating: currentRating || 0,
      maxRating: maxRating || 0
    });

    if (codeforcesHandle) {
      const cfData = await fetchCodeforcesInfo(codeforcesHandle);
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.lastCFUpdate = cfData.lastCFUpdate;
    }

    await student.save();
    // Map _id to id and cfHandle to codeforcesHandle when returning
    const { _id, cfHandle, ...rest } = student.toObject();
    res.status(201).json({ id: _id, codeforcesHandle: cfHandle, ...rest });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ ALL
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    // Map _id to id and cfHandle to codeforcesHandle for each student
    const formatted = students.map(s => {
      const { _id, cfHandle, ...rest } = s.toObject();
      return { id: _id, codeforcesHandle: cfHandle, ...rest };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ ONE — IMPORTANT ✅
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    // Map _id to id and cfHandle to codeforcesHandle
    const { _id, cfHandle, ...rest } = student.toObject();
    res.json({ id: _id, codeforcesHandle: cfHandle, ...rest });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { name, email, phone, codeforcesHandle, currentRating, maxRating } = req.body;

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    if (currentRating !== undefined) student.currentRating = currentRating;
    if (maxRating !== undefined) student.maxRating = maxRating;

    if (codeforcesHandle && codeforcesHandle !== student.cfHandle) {
      student.cfHandle = codeforcesHandle;
      const cfData = await fetchCodeforcesInfo(codeforcesHandle);
      student.currentRating = cfData.currentRating;
      student.maxRating = cfData.maxRating;
      student.lastCFUpdate = cfData.lastCFUpdate;
    }

    await student.save();
    // Map _id to id and cfHandle to codeforcesHandle
    const { _id, cfHandle, ...rest } = student.toObject();
    res.json({ id: _id, codeforcesHandle: cfHandle, ...rest });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
