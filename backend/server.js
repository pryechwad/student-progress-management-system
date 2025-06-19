require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 👈 yeh add karo
const studentRoutes = require('./routes/studentRoutes');
const syncRoutes = require('./routes/syncRoutes');
const runDailySync = require('./config/cron');

const app = express();
app.use(cors()); // 👈 yeh zaroor add karo
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

app.use('/api/students', studentRoutes);
app.use('/api/sync', syncRoutes);

runDailySync();

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
