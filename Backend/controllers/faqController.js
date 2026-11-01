const Faq = require('../models/Faq');
const { handleError, parseId } = require('../utils/api');

function isNonNegativeInteger(value) {
    return value !== null && value !== ''
        && Number.isSafeInteger(Number(value)) && Number(value) >= 0;
}

exports.getFaqs = async (req, res) => {
    try {
        const faqs = await Faq.findAll({
            where: req.user ? {} : { is_active: true },
            order: [['urutan', 'ASC'], ['id', 'ASC']]
        });
        return res.status(200).json(faqs);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getFaqById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const faq = await Faq.findOne({
            where: {
                id,
                ...(req.user ? {} : { is_active: true })
            }
        });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        return res.status(200).json(faq);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createFaq = async (req, res) => {
    try {
        const { pertanyaan, jawaban, urutan = 0, is_active = true } = req.body || {};
        if (typeof pertanyaan !== 'string' || !pertanyaan.trim()
            || typeof jawaban !== 'string' || !jawaban.trim()) {
            return res.status(400).json({ message: 'pertanyaan and jawaban are required' });
        }
        if (!isNonNegativeInteger(urutan)) {
            return res.status(400).json({ message: 'urutan must be a non-negative integer' });
        }
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: 'is_active must be a boolean' });
        }

        const faq = await Faq.create({
            pertanyaan: pertanyaan.trim(),
            jawaban: jawaban.trim(),
            urutan: Number(urutan),
            is_active
        });
        return res.status(201).json(faq);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateFaq = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const faq = await Faq.findByPk(id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        const body = req.body || {};
        const updates = {};
        for (const field of ['pertanyaan', 'jawaban']) {
            if (body[field] !== undefined) {
                if (typeof body[field] !== 'string' || !body[field].trim()) {
                    return res.status(400).json({ message: `${field} cannot be empty` });
                }
                updates[field] = body[field].trim();
            }
        }
        if (body.urutan !== undefined) {
            if (!isNonNegativeInteger(body.urutan)) {
                return res.status(400).json({ message: 'urutan must be a non-negative integer' });
            }
            updates.urutan = Number(body.urutan);
        }
        if (body.is_active !== undefined) {
            if (typeof body.is_active !== 'boolean') {
                return res.status(400).json({ message: 'is_active must be a boolean' });
            }
            updates.is_active = body.is_active;
        }

        await faq.update(updates);
        return res.status(200).json(faq);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteFaq = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const faq = await Faq.findByPk(id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        await faq.destroy();
        return res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};
