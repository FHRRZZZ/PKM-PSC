const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const KategoriBerita = sequelize.define('KategoriBerita', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'kategori_berita',
    timestamps: true
});

module.exports = KategoriBerita;