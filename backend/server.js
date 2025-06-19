const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock student data
let students = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    phone: '1234567890',
    codeforcesHandle: 'alice_cf',
    currentRating: 1450,
    maxRating: 1500
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    phone: '2345678901',
    codeforcesHandle: 'bob_cf',
    currentRating: 1700,
    maxRating: 1750
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    phone: '3456789012',
    codeforcesHandle: 'charlie_cf',
    currentRating: 1200,
    maxRating: 1300
  },
  {
    id: 4,
    name: 'Diana',
    email: 'diana@example.com',
    phone: '4567890123',
    codeforcesHandle: 'diana_cf',
    currentRating: 1600,
    maxRating: 1650
  },
];

// API endpoint
app.get('/api/students', (req, res) => {
  res.json(students);
});

// GET single student
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// POST add student
app.post('/api/students', (req, res) => {
  const newStudent = { id: Date.now(), ...req.body };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT edit student
app.put('/api/students/:id', (req, res) => {
  const idx = students.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  students[idx] = { ...students[idx], ...req.body };
  res.json(students[idx]);
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  students = students.filter(s => s.id !== parseInt(req.params.id));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});