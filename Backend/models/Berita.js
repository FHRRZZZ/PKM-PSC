
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Berita = sequelize.define('Berita', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    kategori_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'kategori_berita',
            key: 'id'
        }
    },
    judul: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true
    },
    deskripsi: {
        type: DataTypes.TEXT('medium'),
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('draft', 'terbit'),
        allowNull: false,
        defaultValue: 'draft'
    },
    tanggal_terbit: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'berita',
    timestamps: true
});

module.exports = Berita;
