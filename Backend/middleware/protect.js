const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protects = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured');
        return res.status(500).json({ message: 'Server error' });
    }

    let tokenUser;
    try {
        tokenUser = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await Admin.findByPk(tokenUser.id, {
            attributes: ['id', 'username', 'email', 'role']
        });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!['admin', 'superadmin'].includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};