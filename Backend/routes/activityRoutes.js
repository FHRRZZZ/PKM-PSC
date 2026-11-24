const express = require('express');
const activityController = require('../controllers/activityController');
const { protects, requireRole } = require('../middleware/protect');

const router = express.Router();

router.get('/', protects, requireRole('superadmin'), activityController.getActivities);

module.exports = router;
