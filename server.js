const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const { errorHandler } = require('./utils/errorHandler');
const http = require('http');
const socketIo = require('socket.io');
const initializeSocket = require('./socket/socket');
const path = require('path');

// Carica variabili d'ambiente
dotenv.config();

// Verifica delle variabili d'ambiente critiche
const requiredEnvVars = ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'UPLOAD_PATH'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error(`Faltan variables de entorno: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Regola in base alle tue esigenze
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inizializza WebSocket
try {
    initializeSocket(io);
} catch (err) {
    console.error('Error al inicializar WebSocket:', err.message);
    process.exit(1);
}

// Rotte
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/attachments', require('./routes/attachments'));
app.use('/api-docs', require('./routes/swagger'));

// Gestione errori
app.use(errorHandler);

// Avvio server
const PORT = process.env.PORT || 3000;
sequelize
    .authenticate()
    .then(() => {
        console.log('Conessione al database avvenuta con successo');
        return sequelize.sync({ force: false }); // Sincronizza i modelli senza cancellare i dati
    })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch(err => {
        console.error('Errore nella sincronizzazione del database', err.message);
        process.exit(1);
    });