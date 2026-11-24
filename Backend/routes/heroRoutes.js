const express = require('express');
const heroController = require('../controllers/heroController');
const { protects, requireRole } = require('../middleware/protect');
const { imageUpload } = require('../middleware/upload');

const router = express.Router();
const adminOnly = [protects, requireRole('admin', 'superadmin')];
const uploadFields = imageUpload.fields([
    { name: 'background_image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
]);

router.get('/', heroController.getPublicSlides);
router.get('/admin', ...adminOnly, heroController.getAdminSlides);
router.get('/admin/:id', ...adminOnly, heroController.getAdminSlide);
router.post('/', ...adminOnly, uploadFields, heroController.createSlide);
router.put('/:id', ...adminOnly, uploadFields, heroController.updateSlide);
router.delete('/:id', ...adminOnly, heroController.deleteSlide);

module.exports = router;
