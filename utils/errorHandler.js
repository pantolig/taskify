class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Gestione errori specifici
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors.map(e => e.message),
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: 'Duplicate entry',
            errors: err.errors.map(e => e.message),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    // Errore generico
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
};

// Funzione per creare errori personalizzati
const createError = (message, statusCode) => {
    return new AppError(message, statusCode);
};

module.exports = { errorHandler, createError };