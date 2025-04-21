const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkBoardAccess = require('../middleware/role');
const { createCard, getCards, updateCard, deleteCard, moveCard } = require('../controllers/cardController');

const router = express.Router();

router.post(
    '/',
    [
        auth,
        checkBoardAccess(),
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        check('list_id', 'List ID is required').isInt(),
        validate,
    ],
    createCard
);

router.get('/:listId', [auth, checkBoardAccess()], getCards);
router.put(
    '/:id',
    [
        auth,
        checkBoardAccess(),
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        check('position', 'Position must be a positive integer').optional().isInt({ min: 0 }),
        check('due_date', 'Invalid due date').optional().isISO8601(),
        validate,
    ],
    updateCard
);
router.delete('/:id', [auth, checkBoardAccess()], deleteCard);
router.put(
    '/:id/move',
    [
        auth,
        checkBoardAccess(),
        check('list_id', 'List ID is required').isInt(),
        check('position', 'Position must be a positive integer').isInt({ min: 0 }),
        validate,
    ],
    moveCard
);

module.exports = router;