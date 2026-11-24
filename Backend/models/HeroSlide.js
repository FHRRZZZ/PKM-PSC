const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HeroSlide = sequelize.define('HeroSlide', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    eyebrow: { type: DataTypes.STRING(120), allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    background_image: { type: DataTypes.STRING(255), allowNull: true },
    logo: { type: DataTypes.STRING(255), allowNull: true },
    primary_label: { type: DataTypes.STRING(80), allowNull: true },
    primary_link: { type: DataTypes.STRING(255), allowNull: true },
    secondary_label: { type: DataTypes.STRING(80), allowNull: true },
    secondary_link: { type: DataTypes.STRING(255), allowNull: true },
    urutan: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'hero_slide', timestamps: true });

module.exports = HeroSlide;
