const express = require('express');
const auth = require('../middleware/auth');
const checkBoardAccess = require('../middleware/role');
const upload = require('../controllers/attachmentController').upload;
const { createAttachment, deleteAttachment } = require('../controllers/attachmentController');

const router = express.Router();

router.post(
    '/',
    [auth, checkBoardAccess(), upload.single('file')],
    createAttachment
);

router.delete('/:id', [auth, checkBoardAccess()], deleteAttachment);

module.exports = router;