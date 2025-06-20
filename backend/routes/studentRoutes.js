const express = require('express');
const router = express.Router();
const { students, getNextId } = require('../mockData');

// ✅ CREATE
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle, currentRating, maxRating } = req.body;
    
    const student = {
      id: getNextId().toString(),
      name: name || '',
      email: email || '',
      phone: phone || '',
      codeforcesHandle: codeforcesHandle || '',
      currentRating: currentRating || 0,
      maxRating: maxRating || 0,
      lastCFUpdate: null,
      inactivityRemindersSent: 0,
      disableAutoEmail: false
    };

    students.push(student);
    res.status(201).json(student);

  } catch (err) {
    console.error('Error creating student:', err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ ALL
router.get('/', async (req, res) => {
  try {
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ ONE
router.get('/:id', async (req, res) => {
  try {
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE
router.put('/:id', async (req, res) => {
  try {
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { name, email, phone, codeforcesHandle, currentRating, maxRating, disableAutoEmail } = req.body;
    const student = students[studentIndex];

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (codeforcesHandle !== undefined) student.codeforcesHandle = codeforcesHandle;
    if (currentRating !== undefined) student.currentRating = currentRating;
    if (maxRating !== undefined) student.maxRating = maxRating;
    if (disableAutoEmail !== undefined) student.disableAutoEmail = disableAutoEmail;

    students[studentIndex] = student;
    res.json(student);

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
  try {
    const studentIndex = students.findIndex(s => s.id === req.params.id);
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    students.splice(studentIndex, 1);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;