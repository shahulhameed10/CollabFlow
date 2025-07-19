import { Request, Response } from 'express';
import TaskComment from '../models/Taskcomment';
import Task from '../models/Task';
import User from '../models/User';

// Add Comment
export const addComment = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = await TaskComment.create({
        content,
        taskId: Number(taskId),
        userId: req.user?.id
    });

    res.status(201).json(comment);
};

// Get Comments
//Code optimised by set limit and fetch recent comments
export const getComments = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const comments = await TaskComment.findAll({
        where: { taskId: Number(taskId) },
        include: [{
            model: User,
            as: 'author',  
            attributes: ['id', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: 5
    });

    res.json(comments);
};

