require('dotenv').config();
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const { sequelize } = require('../config/db');

async function seedAdmin() {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
        throw new Error('Set ADMIN_USERNAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters');
    }

    await sequelize.authenticate();
    await sequelize.sync();
    const existingAdmin = await Admin.findOne({ where: { email: ADMIN_EMAIL } });
    if (existingAdmin) {
        console.log('An admin with ADMIN_EMAIL already exists; no changes were made.');
        return;
    }

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password,
        role: 'superadmin'
    });
    console.log(`Created admin account ${ADMIN_EMAIL}.`);
}

seedAdmin()
    .catch((error) => {
        console.error('Unable to seed admin account:', error);
        process.exitCode = 1;
    })
    .finally(() => sequelize.close());
