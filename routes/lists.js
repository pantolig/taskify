const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const checkBoardAccess = require('../middleware/role');
const { createList, getLists, updateList, deleteList } = require('../controllers/listController');

const router = express.Router();

router.post(
    '/',
    [
        auth,
        checkBoardAccess(),
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        check('board_id', 'Board ID is required').isInt(),
        validate,
    ],
    createList
);

router.get('/:boardId', [auth, checkBoardAccess()], getLists);
router.put(
    '/:id',
    [
        auth,
        checkBoardAccess(),
        check('title', 'Title must be 1-100 characters').isLength({ min: 1, max: 100 }),
        check('position', 'Position must be a positive integer').optional().isInt({ min: 0 }),
        validate,
    ],
    updateList
);
router.delete('/:id', [auth, checkBoardAccess('admin')], deleteList);

module.exports = router;