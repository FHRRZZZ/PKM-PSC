
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Kontak = sequelize.define('Kontak', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    no_darurat: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    hotline: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING(300),
        allowNull: false
    }
}, {
    tableName: 'kontak',
    timestamps: false
});

module.exports = Kontak;
