require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Import cron logic
const { fetchAndUpdateCodeforcesData, job } = require('./config/cron');

// ✅ Import routes
const studentRoutes = require('./routes/studentRoutes');
const syncRoutes = require('./routes/syncRoutes');
const codeforcesRoutes = require('./routes/codeforcesRoutes'); // ✅ OPTIONAL if you have custom CF endpoints

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.log("Continuing without MongoDB - using in-memory storage");
  });

// ✅ Use routes
app.use('/api/students', studentRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/settings', require('./routes/settings'));
app.use('/api/profile', require('./routes/profileRoutes'));

// ✅ Start daily cron
job.start();

// ✅ OPTIONAL: run once immediately when server starts
fetchAndUpdateCodeforcesData();

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
