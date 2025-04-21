const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Card = require('./Card');
const User = require('./User');

const Attachment = sequelize.define('Attachment', {
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
    file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: [1, 255] },
    },
    file_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    file_type: {
        type: DataTypes.STRING(50),
        validate: { len: [0, 50] },
    },
}, {
    timestamps: true,
    tableName: 'attachments',
});

Attachment.belongsTo(Card, { foreignKey: 'card_id' });
Attachment.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Attachment;