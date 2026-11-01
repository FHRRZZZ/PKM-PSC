const Berita = require('../models/Berita');
const KategoriBerita = require('../models/KategoriBerita');
const { getUniqueSlug, handleError, parseId } = require('../utils/api');

exports.getAllBerita = async (req, res) => {
    try {
        const berita = await Berita.findAll({
            where: req.user ? {} : { status: 'terbit' },
            include: [{ model: KategoriBerita, as: 'kategori' }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(berita);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getBeritaById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const berita = await Berita.findOne({
            where: {
                id,
                ...(req.user ? {} : { status: 'terbit' })
            },
            include: [{ model: KategoriBerita, as: 'kategori' }]
        });
        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }
        res.status(200).json(berita);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getBeritaBySlug = async (req, res) => {
    try {
        const berita = await Berita.findOne({
            where: {
                slug: req.params.slug,
                ...(req.user ? {} : { status: 'terbit' })
            },
            include: [{ model: KategoriBerita, as: 'kategori' }]
        });
        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }
        return res.status(200).json(berita);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createBerita = async (req, res) => {
    try {
        const { judul, kategori_id, deskripsi, foto, status, tanggal_terbit } = req.body || {};
        if (!judul || !String(judul).trim() || !deskripsi || !String(deskripsi).trim()) {
            return res.status(400).json({ message: 'judul and deskripsi are required' });
        }

        if (!Number.isInteger(Number(kategori_id)) || Number(kategori_id) < 1) {
            return res.status(400).json({ message: 'kategori_id is invalid' });
        }
        const kategori = await KategoriBerita.findByPk(Number(kategori_id));
        if (!kategori) {
            return res.status(400).json({ message: 'kategori_id is invalid' });
        }
        if (status !== undefined && !['draft', 'terbit'].includes(status)) {
            return res.status(400).json({ message: 'status must be draft or terbit' });
        }
        if (foto !== undefined && foto !== null && typeof foto !== 'string') {
            return res.status(400).json({ message: 'foto must be a string or null' });
        }
        if (tanggal_terbit !== undefined && tanggal_terbit !== null
            && (typeof tanggal_terbit !== 'string' || !Number.isFinite(Date.parse(tanggal_terbit)))) {
            return res.status(400).json({ message: 'tanggal_terbit is invalid' });
        }

        const slug = await getUniqueSlug(Berita, req.body.slug || judul);
        if (!slug) {
            return res.status(400).json({ message: 'slug is invalid' });
        }

        const newBerita = await Berita.create({
            judul: String(judul).trim(),
            kategori_id: Number(kategori_id),
            deskripsi: String(deskripsi).trim(),
            foto: foto || null,
            slug,
            status: status || 'draft',
            tanggal_terbit: tanggal_terbit || (status === 'terbit' ? new Date() : null)
        });
        const createdBerita = await Berita.findByPk(newBerita.id, {
            include: [{ model: KategoriBerita, as: 'kategori' }]
        });
        return res.status(201).json(createdBerita);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateBerita = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const berita = await Berita.findByPk(id);
        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }

        const { judul, kategori_id, deskripsi, foto, status, tanggal_terbit } = req.body || {};
        const updates = {};
        if (judul !== undefined) {
            if (!String(judul).trim()) {
                return res.status(400).json({ message: 'judul cannot be empty' });
            }
            updates.judul = String(judul).trim();
            const slug = await getUniqueSlug(Berita, req.body.slug || judul, berita.id);
            if (!slug) {
                return res.status(400).json({ message: 'slug is invalid' });
            }
            updates.slug = slug;
        } else if (req.body.slug !== undefined) {
            const slug = await getUniqueSlug(Berita, req.body.slug, berita.id);
            if (!slug) {
                return res.status(400).json({ message: 'slug is invalid' });
            }
            updates.slug = slug;
        }
        if (kategori_id !== undefined) {
            if (!Number.isInteger(Number(kategori_id)) || Number(kategori_id) < 1) {
                return res.status(400).json({ message: 'kategori_id is invalid' });
            }
            const kategori = await KategoriBerita.findByPk(Number(kategori_id));
            if (!kategori) {
                return res.status(400).json({ message: 'kategori_id is invalid' });
            }
            updates.kategori_id = Number(kategori_id);
        }
        if (deskripsi !== undefined) {
            if (!String(deskripsi).trim()) {
                return res.status(400).json({ message: 'deskripsi cannot be empty' });
            }
            updates.deskripsi = String(deskripsi).trim();
        }
        if (foto !== undefined) {
            if (foto !== null && typeof foto !== 'string') {
                return res.status(400).json({ message: 'foto must be a string or null' });
            }
            updates.foto = foto || null;
        }
        if (status !== undefined) {
            if (!['draft', 'terbit'].includes(status)) {
                return res.status(400).json({ message: 'status must be draft or terbit' });
            }
            updates.status = status;
            if (status === 'terbit' && tanggal_terbit === undefined && !berita.tanggal_terbit) {
                updates.tanggal_terbit = new Date();
            }
        }
        if (tanggal_terbit !== undefined) {
            if (tanggal_terbit !== null && tanggal_terbit !== ''
                && (typeof tanggal_terbit !== 'string' || !Number.isFinite(Date.parse(tanggal_terbit)))) {
                return res.status(400).json({ message: 'tanggal_terbit is invalid' });
            }
            updates.tanggal_terbit = tanggal_terbit || null;
        }

        await berita.update(updates);
        const updatedBerita = await Berita.findByPk(berita.id, {
            include: [{ model: KategoriBerita, as: 'kategori' }]
        });
        return res.status(200).json(updatedBerita);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteBerita = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const berita = await Berita.findByPk(id);
        if (!berita) {
            return res.status(404).json({ message: 'Berita not found' });
        }
        await berita.destroy();
        return res.status(200).json({ message: 'Berita deleted successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getAllKategoriBerita = async (req, res) => {
    try {
        const kategori = await KategoriBerita.findAll({
            order: [['nama', 'ASC']]
        });
        return res.status(200).json(kategori);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.getKategoriBeritaById = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kategori = await KategoriBerita.findByPk(id, {
            include: [{
                model: Berita,
                as: 'berita',
                where: { status: 'terbit' },
                required: false
            }]
        });
        if (!kategori) {
            return res.status(404).json({ message: 'Kategori berita not found' });
        }
        return res.status(200).json(kategori);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.createKategoriBerita = async (req, res) => {
    try {
        const { nama } = req.body || {};
        if (!nama || !String(nama).trim()) {
            return res.status(400).json({ message: 'nama is required' });
        }
        const slug = await getUniqueSlug(KategoriBerita, req.body.slug || nama);
        if (!slug) {
            return res.status(400).json({ message: 'slug is invalid' });
        }
        const kategori = await KategoriBerita.create({
            nama: String(nama).trim(),
            slug
        });
        return res.status(201).json(kategori);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.updateKategoriBerita = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kategori = await KategoriBerita.findByPk(id);
        if (!kategori) {
            return res.status(404).json({ message: 'Kategori berita not found' });
        }

        const { nama, slug } = req.body || {};
        const updates = {};
        if (nama !== undefined) {
            if (!String(nama).trim()) {
                return res.status(400).json({ message: 'nama cannot be empty' });
            }
            updates.nama = String(nama).trim();
            updates.slug = await getUniqueSlug(KategoriBerita, slug || nama, kategori.id);
        } else if (slug !== undefined) {
            updates.slug = await getUniqueSlug(KategoriBerita, slug, kategori.id);
        }
        if (updates.slug === null) {
            return res.status(400).json({ message: 'slug is invalid' });
        }

        await kategori.update(updates);
        return res.status(200).json(kategori);
    } catch (error) {
        return handleError(res, error);
    }
};

exports.deleteKategoriBerita = async (req, res) => {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'id is invalid' });
        }
        const kategori = await KategoriBerita.findByPk(id);
        if (!kategori) {
            return res.status(404).json({ message: 'Kategori berita not found' });
        }
        if (await Berita.count({ where: { kategori_id: kategori.id } })) {
            return res.status(409).json({ message: 'Kategori berita masih digunakan oleh berita' });
        }
        await kategori.destroy();
        return res.status(200).json({ message: 'Kategori berita deleted successfully' });
    } catch (error) {
        return handleError(res, error);
    }
};