const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');

// Get student profile data
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { _id, cfHandle, ...rest } = student.toObject();
    res.json({ id: _id, codeforcesHandle: cfHandle, ...rest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contest history
router.get('/:id/contests', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const contests = await Contest.find({
      studentId: req.params.id,
      participationTimeSeconds: { $gte: cutoffDate.getTime() / 1000 }
    }).sort({ participationTimeSeconds: 1 });

    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get problem solving stats
router.get('/:id/problems', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const submissions = await Submission.find({
      studentId: req.params.id,
      verdict: 'OK',
      creationTimeSeconds: { $gte: cutoffDate.getTime() / 1000 }
    });

    // Calculate stats
    const totalSolved = submissions.length;
    const avgRating = submissions.reduce((sum, s) => sum + (s.problemRating || 0), 0) / totalSolved || 0;
    const mostDifficult = submissions.reduce((max, s) => 
      (s.problemRating || 0) > (max.problemRating || 0) ? s : max, 
      { problemName: 'None', problemRating: 0 }
    );
    
    // Rating buckets
    const buckets = {
      '800-999': 0, '1000-1199': 0, '1200-1399': 0, 
      '1400-1599': 0, '1600-1799': 0, '1800+': 0
    };
    
    submissions.forEach(s => {
      const rating = s.problemRating || 0;
      if (rating < 1000) buckets['800-999']++;
      else if (rating < 1200) buckets['1000-1199']++;
      else if (rating < 1400) buckets['1200-1399']++;
      else if (rating < 1600) buckets['1400-1599']++;
      else if (rating < 1800) buckets['1600-1799']++;
      else buckets['1800+']++;
    });

    // Heatmap data
    const heatmap = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime() / 1000;
      const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime() / 1000;
      
      const count = submissions.filter(s => 
        s.creationTimeSeconds >= dayStart && s.creationTimeSeconds <= dayEnd
      ).length;
      
      heatmap.push({
        date: new Date(dayStart * 1000).toISOString().slice(0, 10),
        count
      });
    }

    res.json({
      totalSolved,
      avgRating: Math.round(avgRating),
      avgPerDay: Math.round(totalSolved / days * 10) / 10,
      mostDifficult: {
        name: mostDifficult.problemName,
        rating: mostDifficult.problemRating
      },
      ratingBuckets: Object.entries(buckets).map(([rating, count]) => ({ rating, count })),
      heatmap
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;