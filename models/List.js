const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Board = require('./Board');

const List = sequelize.define('List', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    board_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: Board, key: 'id' },
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [1, 100] },
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
}, {
    timestamps: true,
    tableName: 'lists',
});

List.belongsTo(Board, { foreignKey: 'board_id' });

module.exports = List;