const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const List = require('./List');

const Card = sequelize.define('Card', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    list_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: List, key: 'id' },
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { len: [1, 100] },
    },
    description: {
        type: DataTypes.TEXT,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    due_date: {
        type: DataTypes.DATE,
        validate: { isDate: true, isAfter: new Date().toISOString() },
    },
}, {
    timestamps: true,
    tableName: 'cards',
});

Card.belongsTo(List, { foreignKey: 'list_id' });

module.exports = Card;