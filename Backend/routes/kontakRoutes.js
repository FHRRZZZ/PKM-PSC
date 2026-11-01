const express = require('express');
const kontakController = require('../controllers/kontakController');
const { protects } = require('../middleware/protect');

const router = express.Router();

router.get('/', kontakController.getAllKontak);
router.get('/:id', kontakController.getKontakById);
router.post('/', protects, kontakController.createKontak);
router.put('/:id', protects, kontakController.updateKontak);
router.delete('/:id', protects, kontakController.deleteKontak);

module.exports = router;
