const express = require('express');
const faqController = require('../controllers/faqController');
const { protects } = require('../middleware/protect');

const router = express.Router();

router.get('/admin', protects, faqController.getFaqs);
router.get('/admin/:id', protects, faqController.getFaqById);
router.get('/', faqController.getFaqs);
router.get('/:id', faqController.getFaqById);
router.post('/', protects, faqController.createFaq);
router.put('/:id', protects, faqController.updateFaq);
router.delete('/:id', protects, faqController.deleteFaq);

module.exports = router;
