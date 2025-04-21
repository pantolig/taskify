const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Attachment, Card } = require('../models');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images and PDFs are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

exports.upload = upload;

exports.createAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { card_id } = req.body;
        const attachment = await Attachment.create({
            card_id,
            user_id: req.user.id,
            file_name: req.file.originalname,
            file_path: req.file.path,
            file_type: req.file.mimetype,
        });
        res.status(201).json(attachment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAttachment = async (req, res) => {
    try {
        const attachment = await Attachment.findByPk(req.params.id);
        if (!attachment) {
            return res.status(404).json({ message: 'Attachment not found' });
        }
        if (attachment.user_id !== req.user.id && req.boardRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        fs.unlinkSync(attachment.file_path);
        await attachment.destroy();
        res.json({ message: 'Attachment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};