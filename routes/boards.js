const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkBoardAccess = require('../middleware/role');
const { createBoard, getBoards, getBoard, updateBoard, deleteBoard, addMember } = require('../controllers/boardController');

const router = express.Router();

router.post(
    '/',
    [
        auth,
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        validate,
    ],
    createBoard
);

router.get('/', auth, getBoards);
router.get('/:id', [auth, checkBoardAccess()], getBoard);
router.put(
    '/:id',
    [
        auth,
        checkBoardAccess('admin'),
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        validate,
    ],
    updateBoard
);
router.delete('/:id', [auth, checkBoardAccess('admin')], deleteBoard);
router.post(
    '/:id/members',
    [
        auth,
        checkBoardAccess('admin'),
        check('user_id', 'User ID is required').isInt(),
        validate,
    ],
    addMember
);

module.exports = router;