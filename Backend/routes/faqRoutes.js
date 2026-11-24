const express = require('express');
const faqController = require('../controllers/faqController');
const { protects, requireRole } = require('../middleware/protect');

const router = express.Router();
const requireSuperadmin = requireRole('admin', 'superadmin');

router.get('/admin', protects, requireSuperadmin, faqController.getFaqs);
router.get('/admin/:id', protects, requireSuperadmin, faqController.getFaqById);
router.get('/', faqController.getFaqs);
router.get('/:id', faqController.getFaqById);
router.post('/', protects, requireSuperadmin, faqController.createFaq);
router.put('/:id', protects, requireSuperadmin, faqController.updateFaq);
router.delete('/:id', protects, requireSuperadmin, faqController.deleteFaq);

module.exports = router;
