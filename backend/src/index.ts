import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import sequelize from './utils/db';
import authRoutes from './routes/authRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import * as dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { seedData } from './utils/seed';
import taskCommentRoutes from './routes/taskCommentRoutes';
import './models/Association';


dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tasks/comments', taskCommentRoutes);


// Test Route
app.get('/', (req, res) => res.send('🚀 CollabFlow API is running!'));

// Error Handling Middleware (after routes)
app.use(errorHandler);

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

app.locals.io = io;

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('🔗 A user connected');

    // Real-time Task Updates
    socket.on('new-task', (task) => {
        socket.broadcast.emit('task-updated', task);
    });

    // Real-time Project Updates
    socket.on('new-project', (project) => {
        socket.broadcast.emit('project-updated', project);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected');
    });

    socket.on('error', (err) => {
    console.error('Socket error received:', err);
});

});


// Start Server Function
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('🟢 Database connected successfully.');

        await sequelize.sync({ force: true });
        await seedData();

        server.listen(5000, () => {
            console.log('🚀 Server with Socket.IO running at http://localhost:5000');
        });

    } catch (error) {
        console.error('❌ Error starting the server:', error);
    }
};

startServer();
