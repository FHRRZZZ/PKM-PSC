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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/layanan', layananRoutes);

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
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
});

async function startServer() {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync();
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