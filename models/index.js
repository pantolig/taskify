const sequelize = require('../config/database');
const User = require('./User');
const Board = require('./Board');
const List = require('./List');
const Card = require('./Card');
const Comment = require('./Comment');
const Attachment = require('./Attachment');
const BoardMember = require('./BoardMember');

// Associazioni
User.hasMany(Board, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
Board.hasMany(List, { foreignKey: 'board_id', onDelete: 'CASCADE' });
List.hasMany(Card, { foreignKey: 'list_id', onDelete: 'CASCADE' });
Card.hasMany(Comment, { foreignKey: 'card_id', onDelete: 'CASCADE' });
Card.hasMany(Attachment, { foreignKey: 'card_id', onDelete: 'CASCADE' });
Board.hasMany(BoardMember, { foreignKey: 'board_id', onDelete: 'CASCADE' });
User.hasMany(BoardMember, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = {
    sequelize,
    User,
    Board,
    List,
    Card,
    Comment,
    Attachment,
    BoardMember,
};