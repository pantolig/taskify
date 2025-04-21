const { BoardMember } = require('../models');

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Unisciti a una stanza per un board
        socket.on('joinBoard', async ({ boardId, userId }) => {
            const member = await BoardMember.findOne({
                where: { board_id: boardId, user_id: userId },
            });
            if (member || (await Board.findOne({ where: { id: boardId, owner_id: userId } }))) {
                socket.join(`board_${boardId}`);
                socket.emit('joinedBoard', { boardId });
            } else {
                socket.emit('error', { message: 'Unauthorized' });
            }
        });

        // Gestisci eventi (es. creazione scheda, spostamento lista)
        socket.on('createCard', ({ boardId, card }) => {
            io.to(`board_${boardId}`).emit('cardCreated', card);
        });

        socket.on('moveCard', ({ boardId, cardId, newListId, position }) => {
            io.to(`board_${boardId}`).emit('cardMoved', { cardId, newListId, position });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = initializeSocket;