const { Comment, Card } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { content, card_id } = req.body;
        const comment = await Comment.create({
            content,
            card_id,
            user_id: req.user.id,
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ where: { card_id: req.params.cardId } });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.user_id !== req.user.id && req.boardRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};