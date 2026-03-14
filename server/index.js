const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require('./config/passport'); // Initialize passport strategy

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and Logging Middleware
app.use(helmet());
app.use(morgan('dev'));

// Core Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Make `io` accessible via `req.app.get('io')` in routes
// Note: We need to pull the `socket.io` instance *up* here
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const groupRoutes = require('./routes/groups');
const errorHandler = require('./middleware/errorHandler');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/groups', groupRoutes);

// Serve the 'uploads' directory statically at /uploads
app.use('/uploads', express.static(__dirname + '/uploads'));

const socketHandlers = require('./sockets');

app.get('/', (req, res) => {
  res.send('StudyBuddy API is running...');
});

// Initialize modular socket.io handlers
socketHandlers(io);

// Catch-all for undefined routes
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404;
    next(error);
});

// Global Error Handling Middleware
// Must be used after all routes and modular middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
