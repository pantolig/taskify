const { Card, List, Board } = require('../models');

exports.createCard = async (req, res) => {
    try {
        const { title, list_id, description, due_date } = req.body;
        const card = await Card.create({ title, list_id, description, due_date });
        res.status(201).json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCards = async (req, res) => {
    try {
        const cards = await Card.findAll({ where: { list_id: req.params.listId } });
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const { title, description, due_date, position } = req.body;
        const card = await Card.findByPk(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        await card.update({ title, description, due_date, position });
        res.json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findByPk(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        await card.destroy();
        res.json({ message: 'Card deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.moveCard = async (req, res) => {
    try {
        const { list_id, position } = req.body;
        const card = await Card.findByPk(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        await card.update({ list_id, position });
        res.json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};