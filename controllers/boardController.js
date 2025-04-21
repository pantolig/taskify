const { Board, BoardMember } = require('../models');

exports.createBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const board = await Board.create({
            title,
            description,
            owner_id: req.user.id,
        });
        await BoardMember.create({ board_id: board.id, user_id: req.user.id, role: 'admin' });
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.findAll({
            where: { owner_id: req.user.id },
        });
        const memberBoards = await Board.findAll({
            include: [{ model: BoardMember, where: { user_id: req.user.id } }],
        });
        res.json([...boards, ...memberBoards]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBoard = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id);
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const board = await Board.findByPk(req.params.id);
        await board.update({ title, description });
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBoard = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id);
        await board.destroy();
        res.json({ message: 'Board deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { user_id } = req.body;
        const boardId = req.params.id;

        // Verifica che l'utente esista
        const user = await User.findByPk(user_id);
        if (!user) {
            throw createError('User not found', 404);
        }

        const existingMember = await BoardMember.findOne({
            where: { board_id: boardId, user_id },
        });
        if (existingMember) {
            throw createError('User is already a member', 400);
        }

        const member = await BoardMember.create({ board_id: boardId, user_id, role: 'member' });
        res.status(201).json(member);
    } catch (err) {
        next(err);
    }
};