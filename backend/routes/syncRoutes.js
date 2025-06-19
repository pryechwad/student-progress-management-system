const express = require('express');
const router = express.Router();
const cfController = require('../controllers/codeforcesController');

router.post('/sync/:id', cfController.syncStudentCF);

module.exports = router;
