const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define('ActivityLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    admin_username: { type: DataTypes.STRING(100), allowNull: false },
    admin_role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'admin' },
    action: { type: DataTypes.STRING(20), allowNull: false },
    method: { type: DataTypes.STRING(10), allowNull: false },
    path: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false },
    ip_address: { type: DataTypes.STRING(64), allowNull: true },
}, {
    tableName: 'ActivityLog',
    timestamps: true,
});

module.exports = ActivityLog;
