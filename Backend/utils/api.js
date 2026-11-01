const { Op } = require('sequelize');

function parseId(value) {
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
        return null;
    }

    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}

function createSlug(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '');
}

async function getUniqueSlug(Model, value, excludeId) {
    const baseSlug = createSlug(value);
    if (!baseSlug) {
        return null;
    }

    let slug = baseSlug;
    let suffix = 2;
    while (await Model.findOne({
        where: {
            slug,
            ...(excludeId ? { id: { [Op.ne]: excludeId } } : {})
        }
    })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
    return slug;
}

function handleError(res, error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'A record with this value already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({ message: 'This record is still in use' });
    }
    return res.status(500).json({ message: 'Server error' });
}

module.exports = { createSlug, getUniqueSlug, handleError, parseId };
