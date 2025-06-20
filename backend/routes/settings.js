const express = require('express');
const router = express.Router();
const { updateCronSchedule, getCurrentCronExpression, fetchAndUpdateCodeforcesData } = require('../config/cron');

// GET current cron schedule
router.get('/cron', (req, res) => {
  res.json({ cronExpression: getCurrentCronExpression() });
});

// PUT /api/settings/cron
router.put('/cron', (req, res) => {
  const { cronExpression } = req.body;
  updateCronSchedule(cronExpression);
  res.json({ message: `Cron updated to ${cronExpression}`, cronExpression });
});

// POST manual sync
router.post('/sync', async (req, res) => {
  try {
    await fetchAndUpdateCodeforcesData();
    res.json({ message: 'Manual sync completed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
