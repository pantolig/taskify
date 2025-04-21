const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Card = require('./Card');
const User = require('./User');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    card_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: Card, key: 'id' },
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { len: [1, 1000] },
    },
}, {
    timestamps: true,
    tableName: 'comments',
});

Comment.belongsTo(Card, { foreignKey: 'card_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Comment;