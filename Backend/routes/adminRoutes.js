const express = require('express');
const adminController = require('../controllers/adminController');
const { protects, requireRole } = require('../middleware/protect');

const router = express.Router();
const superadminOnly = [protects, requireRole('superadmin')];

router.get('/', ...superadminOnly, adminController.getAdmins);
router.post('/', ...superadminOnly, adminController.createAdmin);
router.put('/:id', ...superadminOnly, adminController.updateAdmin);
router.delete('/:id', ...superadminOnly, adminController.deleteAdmin);

module.exports = router;
