const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Board = require('./Board');
const User = require('./User');

const BoardMember = sequelize.define('BoardMember', {
    board_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: { model: Board, key: 'id' },
    },
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: { model: User, key: 'id' },
    },
    role: {
        type: DataTypes.ENUM('admin', 'member'),
        defaultValue: 'member',
    },
}, {
    timestamps: true,
    updatedAt: false,
    tableName: 'board_members',
});

BoardMember.belongsTo(Board, { foreignKey: 'board_id' });
BoardMember.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BoardMember;