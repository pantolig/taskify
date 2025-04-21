const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Board = sequelize.define('Board', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [1, 100] },
    },
    description: {
        type: DataTypes.TEXT,
    },
    owner_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
}, {
    timestamps: true,
    tableName: 'boards',
});

Board.belongsTo(User, { foreignKey: 'owner_id' });

module.exports = Board;