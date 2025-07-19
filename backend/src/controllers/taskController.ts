import { Request, Response } from 'express';
import Task from '../models/Task';
import { Op } from 'sequelize';
import { createClient } from 'redis';
import Project from '../models/Project';

// Redis client setup
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.connect()
    .then(() => console.log('🟢 Redis connected in taskController'))
    .catch(err => console.error('❌ Redis connection failed:', err));



// Create Task
export const createTask = async (req: Request, res: Response) => {
    const { name, status, priority, labels, dueDate, assignedTo, projectId } = req.body;

    try {
        const task = await Task.create({
            name,
            status,
            priority,
            labels,
            dueDate,
            assignedTo,
            projectId
        });

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('task-created', task);

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (err) {
        res.status(500).json({ message: 'Task creation failed', error: err });
    }
};

// Get tasks with filter
export const getTasks = async (req: Request, res: Response) => {
    const { priority, dueDate } = req.query;

    const whereClause: any = {};

    if (priority) whereClause.priority = priority;
    if (dueDate) {
        whereClause.dueDate = {
            [Op.lte]: new Date(dueDate as string)
        };
    }

    // Generate a dynamic cache key based on filters
    const cacheKey = `tasks_cache_${priority || 'all'}_${dueDate || 'all'}`;

    try {
        // Check Redis cache first
        const cachedTasks = await redisClient.get(cacheKey);

        if (cachedTasks) {
            return res.json({
                message: 'Tasks fetched from cache',
                tasks: JSON.parse(cachedTasks)
            });
        }

        // If no cache, fetch from DB
        const tasks = await Task.findAll({ where: whereClause });

        // Store in Redis cache (set expiry to 60 seconds)
        await redisClient.set(cacheKey, JSON.stringify(tasks), { EX: 60 });

        res.json({
            message: 'Tasks fetched from DB',
            tasks
        });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err });
    }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, status, priority, labels, dueDate, assignedTo } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.update({
            name,
            status,
            priority,
            labels,
            dueDate,
            assignedTo
        });

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('task-updated', task);

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (err) {
        res.status(500).json({ message: 'Task update failed', error: err });
    }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await task.destroy();

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('task-deleted', { id });

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Task deletion failed', error: err });
    }
};
