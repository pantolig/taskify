const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { createError } = require('../utils/errorHandler');

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'created_at', 'updated_at'],
        });
        if (!user) {
            throw createError('User not found', 404);
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) {
            throw createError('User not found', 404);
        }

        // Verifica unicità di username ed email
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ where: { username } });
            if (existingUsername) {
                throw createError('Username already taken', 400);
            }
        }
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                throw createError('Email already in use', 400);
            }
        }

        // Aggiorna i campi
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) updates.password_hash = await bcrypt.hash(password, 10);

        await user.update(updates);
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            updated_at: user.updated_at,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            throw createError('User not found', 404);
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email'],
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
};