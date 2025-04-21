const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
    getUserProfile,
    updateUser,
    deleteUser,
    getUsers,
} = require('../controllers/userController');

const router = express.Router();

// Ottieni il profilo dell'utente autenticato
router.get('/me', auth, getUserProfile);

// Aggiorna il profilo dell'utente
router.put(
    '/me',
    [
        auth,
        check('username', 'Username must be 3-50 characters').optional().isLength({ min: 3, max: 50 }),
        check('email', 'Please include a valid email').optional().isEmail(),
        check('password', 'Password must be 6 or more characters').optional().isLength({ min: 6 }),
        validate,
    ],
    updateUser
);

// Elimina l'account dell'utente
router.delete('/me', auth, deleteUser);

// Ottieni lista di utenti (per aggiungere membri ai board)
router.get('/', auth, getUsers);

module.exports = router;