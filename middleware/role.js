const { Board, BoardMember } = require('../models');

const checkBoardAccess = (requiredRole = null) => async (req, res, next) => {
    try {
        const boardId = req.params.boardId || req.body.board_id || req.params.id;
        const board = await Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Verifica se l'utente è il proprietario o un membro
        if (board.owner_id === req.user.id) {
            req.boardRole = 'owner';
            return next();
        }

        const member = await BoardMember.findOne({
            where: { board_id: boardId, user_id: req.user.id },
        });

        if (!member) {
            return res.status(403).json({ message: 'Unauthorized: Not a board member' });
        }

        req.boardRole = member.role;

        if (requiredRole && member.role !== requiredRole) {
            return res.status(403).json({ message: `Unauthorized: ${requiredRole} role required` });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = checkBoardAccess;