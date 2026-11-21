const express = require('express');
const layananController = require('../controllers/layananController');
const { protects } = require('../middleware/protect');
const { imageUpload } = require('../middleware/upload');

const router = express.Router();

router.get('/admin', protects, layananController.getAllLayanan);
router.get('/admin/:id', protects, layananController.getLayananById);
router.get('/slug/:slug', layananController.getLayananBySlug);
router.get('/', layananController.getAllLayanan);
router.get('/:id', layananController.getLayananById);
router.post('/', protects, imageUpload.single('foto'), layananController.createLayanan);
router.put('/:id', protects, imageUpload.single('foto'), layananController.updateLayanan);
router.delete('/:id', protects, layananController.deleteLayanan);

module.exports = router;
