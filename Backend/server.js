const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const beritaRoutes = require('./routes/beritaRoutes');
const faqRoutes = require('./routes/faqRoutes');
const kontakRoutes = require('./routes/kontakRoutes');
const layananRoutes = require('./routes/layananRoutes');
const klinikRoutes = require('./routes/klinikRoutes');
const heroRoutes = require('./routes/heroRoutes');
const activityRoutes = require('./routes/activityRoutes');
const galeriPscRoutes = require('./routes/galeriPscRoutes');
const ActivityLog = require('./models/ActivityLog');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catat request admin setelah middleware proteksi selesai mengisi req.user.
// Logging dilakukan saat response selesai agar status HTTP ikut tersimpan.
app.use((req, res, next) => {
    res.on('finish', () => {
        if (!req.user || req.path === '/api/activity-logs' || req.method === 'OPTIONS') return;
        ActivityLog.create({
            admin_id: req.user.id,
            admin_username: req.user.username,
            admin_role: req.user.role,
            action: req.method === 'GET' ? 'VIEW' : req.method,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            ip_address: req.ip,
        }).catch((error) => console.error('Activity log failed:', error.message));
    });
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/layanan', layananRoutes);
app.use('/api/klinik', klinikRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/activity-logs', activityRoutes);
app.use('/api/galeri-psc', galeriPscRoutes);

app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
    return res.status(404).json({ message: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const status = Number(error.status || error.statusCode);
    if (status >= 400 && status < 500) {
        return res.status(status).json({ message: 'Invalid request body' });
    }
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'Ukuran foto maksimal 5 MB' });
        }
        return res.status(400).json({ message: 'Foto harus berformat JPG atau PNG' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
});

async function startServer() {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync();
    const [layananTypeColumns] = await sequelize.query('SHOW COLUMNS FROM layanan');
    if (!layananTypeColumns.some((column) => column.Field === 'jenis')) {
        await sequelize.query("ALTER TABLE layanan ADD COLUMN jenis VARCHAR(20) NOT NULL DEFAULT 'ambulans'");
    }
    const [layananColumns] = await sequelize.query('SHOW COLUMNS FROM layanan');
    const layananNames = new Set(layananColumns.map((column) => column.Field));
    const layananMetadata = [
        ['akreditasi', 'VARCHAR(150) NULL'],
        ['akreditasi_tahun', 'VARCHAR(10) NULL'],
        ['izin_operasional_nomor', 'VARCHAR(150) NULL'],
        ['izin_operasional_penerbit', 'VARCHAR(150) NULL'],
        ['izin_operasional_file', 'VARCHAR(255) NULL'],
    ];
    for (const [name, definition] of layananMetadata) {
        if (!layananNames.has(name)) await sequelize.query(`ALTER TABLE layanan ADD COLUMN ${name} ${definition}`);
    }
    const [activityColumns] = await sequelize.query('SHOW COLUMNS FROM ActivityLog');
    if (!activityColumns.some((column) => column.Field === 'admin_role')) {
        await sequelize.query("ALTER TABLE ActivityLog ADD COLUMN admin_role VARCHAR(20) NOT NULL DEFAULT 'admin'");
        await sequelize.query("UPDATE ActivityLog l JOIN Admin a ON a.id = l.admin_id SET l.admin_role = a.role");
    }
    // Menambahkan metadata katalog klinik pada database lama tanpa menghapus data.
    const [columns] = await sequelize.query('SHOW COLUMNS FROM klinik_profile');
    const names = new Set(columns.map((column) => column.Field));
    if (!names.has('slug')) await sequelize.query('ALTER TABLE klinik_profile ADD COLUMN slug VARCHAR(180) NULL');
    if (!names.has('is_active')) await sequelize.query('ALTER TABLE klinik_profile ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1');
    await sequelize.query("UPDATE klinik_profile SET slug = 'klinik-psc-119' WHERE id = 1 AND (slug IS NULL OR slug = '')");
    for (const table of ['jam_operasional', 'dokter', 'jadwal_praktik', 'struktur_organisasi', 'alur_berobat', 'penjaminan', 'galeri_fasilitas']) {
        const [childColumns] = await sequelize.query(`SHOW COLUMNS FROM ${table}`);
        if (!childColumns.some((column) => column.Field === 'klinik_id')) {
            await sequelize.query(`ALTER TABLE ${table} ADD COLUMN klinik_id INT UNSIGNED NULL`);
        }
        await sequelize.query(`UPDATE ${table} SET klinik_id = 1 WHERE klinik_id IS NULL`);
    }
    console.log('Database synchronized successfully.');

    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Unable to start the server:', error);
        process.exitCode = 1;
    });
}

module.exports = { app, startServer };
