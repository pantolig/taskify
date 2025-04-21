const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkBoardAccess = require('../middleware/role');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.post(
    '/',
    [
        auth,
        checkBoardAccess(),
        check('content', 'Content must be 1-1000 characters').isLength({ min: 1, max: 1000 }),
        check('card_id', 'Card ID is required').isInt(),
        validate,
    ],
    createComment
);

router.get('/:cardId', [auth, checkBoardAccess()], getComments);
router.delete('/:id', [auth, checkBoardAccess()], deleteComment);

module.exports = router;