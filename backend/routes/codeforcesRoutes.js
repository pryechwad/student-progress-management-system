// routes/codeforcesRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET Codeforces user profile(s)
router.get('/profile', async (req, res) => {
  const { handles } = req.query;

  if (!handles) {
    return res.status(400).json({ message: 'handles query param required' });
  }

  try {
    const url = `https://codeforces.com/api/user.info?handles=${handles}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch Codeforces profile' });
  }
});

// GET Codeforces user submissions
router.get('/submissions', async (req, res) => {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ message: 'handle query param required' });
  }

  try {
    const url = `https://codeforces.com/api/user.status?handle=${handle}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch Codeforces submissions' });
  }
});

module.exports = router;
