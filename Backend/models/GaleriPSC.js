const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

module.exports = sequelize.define('GaleriPSC', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
  judul: { type: DataTypes.STRING(150), allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: true },
  foto: { type: DataTypes.STRING(255), allowNull: false },
  urutan: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'galeri_psc', timestamps: false });
