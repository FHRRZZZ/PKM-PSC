const Layanan = require('../models/Layanan');
const { getUniqueSlug, handleError, parseId } = require('../utils/api');

function isNonNegativeInteger(value) {
    return value !== null && value !== ''
        && Number.isSafeInteger(Number(value)) && Number(value) >= 0;
}

function validTarif(value) {
    return value === null || (
        (typeof value === 'number' || typeof value === 'string')
        && /^\d{1,10}(?:\.\d{1,2})?$/.test(String(value))
        && Number.isFinite(Number(value))
    );
}

exports.getAllLayanan = async (req, res) => {
    try {
        const layanan = await Layanan.findAll({
            where: req.user ? {} : { is_active: true },
            order: [['urutan', 'ASC'], ['id', 'ASC']]
        });
        return res.status(200).json(layanan);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getLayananById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const layanan = await Layanan.findOne({
            where: {
                id,
                ...(req.user ? {} : { is_active: true })
            }
        });
        if (!layanan) {
            return res.status(404).json({ message: 'Layanan not found' });
        }
        return res.status(200).json(layanan);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getLayananBySlug = async (req, res) => {
    try {
        const layanan = await Layanan.findOne({
            where: {
                slug: req.params.slug,
                ...(req.user ? {} : { is_active: true })
            }
        });
        if (!layanan) {
            return res.status(404).json({ message: 'Layanan not found' });
        }
        return res.status(200).json(layanan);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createLayanan = async (req, res) => {
    try {
        const body = req.body || {};
        if (typeof body.nama !== 'string' || !body.nama.trim()
            || typeof body.deskripsi !== 'string' || !body.deskripsi.trim()) {
            return res.status(400).json({ message: 'nama and deskripsi are required' });
        }
        const urutan = body.urutan === undefined ? 0 : body.urutan;
        const isActive = body.is_active === undefined ? true : body.is_active;
        const tarifIsActive = body.tarif_is_active === undefined ? false : body.tarif_is_active;
        const tarif = body.tarif === undefined ? null : body.tarif;
        if (!isNonNegativeInteger(urutan)) {
            return res.status(400).json({ message: 'urutan must be a non-negative integer' });
        }
        if (typeof isActive !== 'boolean' || typeof tarifIsActive !== 'boolean') {
            return res.status(400).json({ message: 'is_active and tarif_is_active must be booleans' });
        }
        if (!validTarif(tarif)) {
            return res.status(400).json({ message: 'tarif must be a non-negative number or null' });
        }
        if (body.foto !== undefined && body.foto !== null && typeof body.foto !== 'string') {
            return res.status(400).json({ message: 'foto must be a string or null' });
        }
        const slug = await getUniqueSlug(Layanan, body.slug || body.nama);
        if (!slug) {
            return res.status(400).json({ message: 'slug is invalid' });
        }

        const layanan = await Layanan.create({
            nama: body.nama.trim(),
            slug,
            deskripsi: body.deskripsi.trim(),
            foto: body.foto || null,
            tarif,
            tarif_is_active: tarifIsActive,
            urutan: Number(urutan),
            is_active: isActive
        });
        return res.status(201).json(layanan);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateLayanan = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const layanan = await Layanan.findByPk(id);
        if (!layanan) {
            return res.status(404).json({ message: 'Layanan not found' });
        }

        const body = req.body || {};
        const updates = {};
        for (const field of ['nama', 'deskripsi']) {
            if (body[field] !== undefined) {
                if (typeof body[field] !== 'string' || !body[field].trim()) {
                    return res.status(400).json({ message: `${field} cannot be empty` });
                }
                updates[field] = body[field].trim();
            }
        }
        if (body.slug !== undefined || body.nama !== undefined) {
            updates.slug = await getUniqueSlug(Layanan, body.slug || body.nama || layanan.nama, id);
            if (!updates.slug) {
                return res.status(400).json({ message: 'slug is invalid' });
            }
        }
        if (body.foto !== undefined) {
            if (body.foto !== null && typeof body.foto !== 'string') {
                return res.status(400).json({ message: 'foto must be a string or null' });
            }
            updates.foto = body.foto || null;
        }
        if (body.tarif !== undefined) {
            if (!validTarif(body.tarif)) {
                return res.status(400).json({ message: 'tarif must be a non-negative number or null' });
            }
            updates.tarif = body.tarif;
        }
        for (const field of ['tarif_is_active', 'is_active']) {
            if (body[field] !== undefined) {
                if (typeof body[field] !== 'boolean') {
                    return res.status(400).json({ message: `${field} must be a boolean` });
                }
                updates[field] = body[field];
            }
        }
        if (body.urutan !== undefined) {
            if (!isNonNegativeInteger(body.urutan)) {
                return res.status(400).json({ message: 'urutan must be a non-negative integer' });
            }
            updates.urutan = Number(body.urutan);
        }

        await layanan.update(updates);
        return res.status(200).json(layanan);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteLayanan = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const layanan = await Layanan.findByPk(id);
        if (!layanan) {
            return res.status(404).json({ message: 'Layanan not found' });
        }
        await layanan.destroy();
        return res.status(200).json({ message: 'Layanan deleted successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};
