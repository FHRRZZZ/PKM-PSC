const express = require('express');
const beritaController = require('../controllers/beritaController');
const { protects } = require('../middleware/protect');

const router = express.Router();

router.get('/admin', protects, beritaController.getAllBerita);
router.get('/kategori', beritaController.getAllKategoriBerita);
router.get('/kategori/:id', beritaController.getKategoriBeritaById);
router.post('/kategori', protects, beritaController.createKategoriBerita);
router.put('/kategori/:id', protects, beritaController.updateKategoriBerita);
router.delete('/kategori/:id', protects, beritaController.deleteKategoriBerita);

router.get('/admin/slug/:slug', protects, beritaController.getBeritaBySlug);
router.get('/admin/:id', protects, beritaController.getBeritaById);
router.get('/slug/:slug', beritaController.getBeritaBySlug);
router.get('/', beritaController.getAllBerita);
router.get('/:id', beritaController.getBeritaById);
router.post('/', protects, beritaController.createBerita);
router.put('/:id', protects, beritaController.updateBerita);
router.delete('/:id', protects, beritaController.deleteBerita);

module.exports = router;
