const { List, Board } = require('../models');

exports.createList = async (req, res) => {
    try {
        const { title, board_id } = req.body;
        const list = await List.create({ title, board_id });
        res.status(201).json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLists = async (req, res) => {
    try {
        const lists = await List.findAll({ where: { board_id: req.params.boardId } });
        res.json(lists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateList = async (req, res) => {
    try {
        const { title, position } = req.body;
        const list = await List.findByPk(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        await list.update({ title, position });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        await list.destroy();
        res.json({ message: 'List deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};