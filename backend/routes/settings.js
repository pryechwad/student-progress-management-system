const express = require('express');
const router = express.Router();
const { updateCronSchedule } = require('../cron');

// PUT /api/settings/cron
router.put('/cron', (req, res) => {
  const { cronExpression } = req.body;
  updateCronSchedule(cronExpression);
  res.json({ message: `Cron updated to ${cronExpression}` });
});

module.exports = router;
