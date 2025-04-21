const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/register',
    [
        check('username', 'Username must be 3-50 characters').isLength({ min: 3, max: 50 }),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        validate,
    ],
    register
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').notEmpty(),
        validate,
    ],
    login
);

module.exports = router;