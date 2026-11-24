const HeroSlide = require('../models/HeroSlide');
const { handleError, parseId } = require('../utils/api');

const stringFields = ['eyebrow', 'title', 'description', 'primary_label', 'primary_link', 'secondary_label', 'secondary_link'];

function bool(value, fallback) {
    if (value === undefined) return fallback;
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
}

function order(value, fallback = 0) {
    if (value === undefined) return fallback;
    return Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null;
}

exports.getPublicSlides = async (_req, res) => {
    try {
        const slides = await HeroSlide.findAll({ where: { is_active: true }, order: [['urutan', 'ASC'], ['id', 'ASC']] });
        return res.status(200).json(slides);
    } catch (error) { return handleError(res, error); }
};

exports.getAdminSlides = async (_req, res) => {
    try {
        return res.status(200).json(await HeroSlide.findAll({ order: [['urutan', 'ASC'], ['id', 'ASC']] }));
    } catch (error) { return handleError(res, error); }
};

exports.getAdminSlide = async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'id is invalid' });
    const slide = await HeroSlide.findByPk(id);
    return slide ? res.status(200).json(slide) : res.status(404).json({ message: 'Hero slide not found' });
};

exports.createSlide = async (req, res) => {
    try {
        const body = req.body || {};
        if (typeof body.title !== 'string' || !body.title.trim()) return res.status(400).json({ message: 'title is required' });
        const urutan = order(body.urutan);
        const isActive = bool(body.is_active, true);
        if (urutan === null || isActive === null) return res.status(400).json({ message: 'urutan or is_active is invalid' });
        const slide = await HeroSlide.create({
            ...Object.fromEntries(stringFields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim() || null : null])),
            title: body.title.trim(),
            background_image: req.files?.background_image?.[0] ? `/uploads/${req.files.background_image[0].filename}` : (body.background_image || null),
            logo: req.files?.logo?.[0] ? `/uploads/${req.files.logo[0].filename}` : (body.logo || null),
            urutan, is_active: isActive,
        });
        return res.status(201).json(slide);
    } catch (error) { return handleError(res, error); }
};

exports.updateSlide = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ message: 'id is invalid' });
        const slide = await HeroSlide.findByPk(id);
        if (!slide) return res.status(404).json({ message: 'Hero slide not found' });
        const body = req.body || {};
        const updates = {};
        for (const field of stringFields) if (body[field] !== undefined) updates[field] = typeof body[field] === 'string' ? body[field].trim() || null : body[field];
        if (body.title !== undefined && (!body.title || typeof body.title !== 'string')) return res.status(400).json({ message: 'title cannot be empty' });
        if (req.files?.background_image?.[0]) updates.background_image = `/uploads/${req.files.background_image[0].filename}`;
        if (req.files?.logo?.[0]) updates.logo = `/uploads/${req.files.logo[0].filename}`;
        if (body.urutan !== undefined) { updates.urutan = order(body.urutan); if (updates.urutan === null) return res.status(400).json({ message: 'urutan is invalid' }); }
        if (body.is_active !== undefined) { updates.is_active = bool(body.is_active); if (updates.is_active === null) return res.status(400).json({ message: 'is_active is invalid' }); }
        await slide.update(updates);
        return res.status(200).json(slide);
    } catch (error) { return handleError(res, error); }
};

exports.deleteSlide = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ message: 'id is invalid' });
        const slide = await HeroSlide.findByPk(id);
        if (!slide) return res.status(404).json({ message: 'Hero slide not found' });
        await slide.destroy();
        return res.status(200).json({ message: 'Hero slide deleted successfully' });
    } catch (error) { return handleError(res, error); }
};
