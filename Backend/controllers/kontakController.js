const Kontak = require('../models/Kontak');
const { handleError, parseId } = require('../utils/api');

const CONTACT_FIELDS = ['no_darurat', 'hotline', 'email', 'alamat'];

exports.getAllKontak = async (req, res) => {
    try {
        const kontak = await Kontak.findAll({ order: [['id', 'ASC']] });
        return res.status(200).json(kontak);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getKontakById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kontak = await Kontak.findByPk(id);
        if (!kontak) {
            return res.status(404).json({ message: 'Kontak not found' });
        }
        return res.status(200).json(kontak);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createKontak = async (req, res) => {
    try {
        const body = req.body || {};
        const missing = CONTACT_FIELDS.find((field) =>
            typeof body[field] !== 'string' || !body[field].trim()
        );
        if (missing) {
            return res.status(400).json({ message: `${missing} is required` });
        }

        const kontak = await Kontak.create(Object.fromEntries(
            CONTACT_FIELDS.map((field) => [field, body[field].trim()])
        ));
        return res.status(201).json(kontak);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateKontak = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kontak = await Kontak.findByPk(id);
        if (!kontak) {
            return res.status(404).json({ message: 'Kontak not found' });
        }

        const updates = {};
        for (const field of CONTACT_FIELDS) {
            if (req.body?.[field] !== undefined) {
                if (typeof req.body[field] !== 'string' || !req.body[field].trim()) {
                    return res.status(400).json({ message: `${field} cannot be empty` });
                }
                updates[field] = req.body[field].trim();
            }
        }
        await kontak.update(updates);
        return res.status(200).json(kontak);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteKontak = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kontak = await Kontak.findByPk(id);
        if (!kontak) {
            return res.status(404).json({ message: 'Kontak not found' });
        }
        await kontak.destroy();
        return res.status(200).json({ message: 'Kontak deleted successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};
