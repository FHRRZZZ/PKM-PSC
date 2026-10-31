
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Layanan = sequelize.define('Layanan', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(170),
        allowNull: false,
        unique: true
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    tarif: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    tarif_is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    urutan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'layanan',
    timestamps: false
});

module.exports = Layanan;
