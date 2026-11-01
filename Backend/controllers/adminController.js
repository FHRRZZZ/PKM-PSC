const bcrypt = require('bcrypt');
const { Transaction } = require('sequelize');
const Admin = require('../models/Admin');
const { handleError, parseId } = require('../utils/api');

const ADMIN_ROLES = ['admin', 'superadmin'];
const ADMIN_ATTRIBUTES = ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'];

function isValidEmail(email) {
    return typeof email === 'string'
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPassword(password) {
    return typeof password === 'string' && password.length >= 12;
}

exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ADMIN_ATTRIBUTES,
            order: [['createdAt', 'ASC']]
        });
        return res.status(200).json(admins);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password, role = 'admin' } = req.body || {};
        if (typeof username !== 'string' || !username.trim()) {
            return res.status(400).json({ message: 'username is required' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'email is invalid' });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'password must be at least 12 characters' });
        }
        if (!ADMIN_ROLES.includes(role)) {
            return res.status(400).json({ message: 'role must be admin or superadmin' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = await Admin.create({
            username: username.trim(),
            email: email.trim(),
            password: hashedPassword,
            role
        });
        return res.status(201).json(await Admin.findByPk(admin.id, {
            attributes: ADMIN_ATTRIBUTES
        }));
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const body = req.body || {};
        const updates = {};
        if (body.username !== undefined) {
            if (typeof body.username !== 'string' || !body.username.trim()) {
                return res.status(400).json({ message: 'username cannot be empty' });
            }
            updates.username = body.username.trim();
        }
        if (body.email !== undefined) {
            if (!isValidEmail(body.email)) {
                return res.status(400).json({ message: 'email is invalid' });
            }
            updates.email = body.email.trim();
        }
        if (body.password !== undefined) {
            if (!isValidPassword(body.password)) {
                return res.status(400).json({ message: 'password must be at least 12 characters' });
            }
            updates.password = await bcrypt.hash(body.password, 12);
        }
        if (body.role !== undefined) {
            if (!ADMIN_ROLES.includes(body.role)) {
                return res.status(400).json({ message: 'role must be admin or superadmin' });
            }
            updates.role = body.role;
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'At least one field is required' });
        }
        if (id === req.user.id && updates.role === 'admin' && admin.role === 'superadmin') {
            return res.status(409).json({ message: 'You cannot demote your own superadmin account' });
        }

        await Admin.sequelize.transaction(async (transaction) => {
            if (admin.role === 'superadmin' && updates.role === 'admin') {
                const superadmins = await Admin.findAll({
                    where: { role: 'superadmin' },
                    attributes: ['id'],
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });
                if (superadmins.length <= 1) {
                    const error = new Error('At least one superadmin must remain');
                    error.status = 409;
                    throw error;
                }
            }
            await admin.update(updates, { transaction });
        });

        return res.status(200).json(await Admin.findByPk(id, {
            attributes: ADMIN_ATTRIBUTES
        }));
    } catch (error) {
        if (error.status === 409) {
            return res.status(409).json({ message: error.message });
        }
        return handleError(res, error);
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        if (id === req.user.id) {
            return res.status(409).json({ message: 'You cannot delete your own account' });
        }

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await Admin.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async (transaction) => {
            if (admin.role === 'superadmin') {
                const superadmins = await Admin.findAll({
                    where: { role: 'superadmin' },
                    attributes: ['id'],
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });
                if (superadmins.length <= 1) {
                    const error = new Error('At least one superadmin must remain');
                    error.status = 409;
                    throw error;
                }
            }
            await admin.destroy({ transaction });
        });

        return res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        if (error.status === 409) {
            return res.status(409).json({ message: error.message });
        }
        return handleError(res, error);
    }
};
