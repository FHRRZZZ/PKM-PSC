const express = require('express');
const kontakController = require('../controllers/kontakController');
const { protects, requireRole } = require('../middleware/protect');

const router = express.Router();
const requireSuperadmin = requireRole('admin', 'superadmin');

router.get('/', kontakController.getAllKontak);
router.get('/:id', kontakController.getKontakById);
router.post('/', protects, requireSuperadmin, kontakController.createKontak);
router.put('/:id', protects, requireSuperadmin, kontakController.updateKontak);
router.delete('/:id', protects, requireSuperadmin, kontakController.deleteKontak);

module.exports = router;
