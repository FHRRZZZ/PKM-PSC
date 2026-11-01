const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protects } = require('../middleware/protect');
const Admin = require('../models/Admin');

const { login } = authController;

router.post('/login', login);

router.get('/me', protects, async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'role']
        });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
