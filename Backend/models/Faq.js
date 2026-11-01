
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Faq = sequelize.define('Faq', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    pertanyaan: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    jawaban: {
        type: DataTypes.TEXT,
        allowNull: false
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
    tableName: 'faq',
    timestamps: false
});

module.exports = Faq;
