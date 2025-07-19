import { Request, Response } from 'express';
import Project from '../models/Project';
import { createClient } from 'redis';
import Workspace from '../models/Workspace';


//create a redisclient for cache
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.connect().then(() => {
    console.log('🟢 Redis connected in projectController');
}).catch(err => {
    console.error('❌ Redis connection failed:', err);
});

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { name, description, deadline, workspaceId } = req.body;

    try {
        // Check if workspace exists
        const workspace = await Workspace.findByPk(workspaceId);
        if (!workspace) {
            return res.status(400).json({ message: 'Invalid workspaceId: Workspace not found' });
        }

        const project = await Project.create({ name, description, deadline, workspaceId });

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('project-created', project);

        return res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (err: any) {
        console.error('Project Creation Error:', err);

        res.status(500).json({
            message: 'Project creation failed',
            error: err.message || err.errors || err
        });
    }
};



// Get all projects with Redis caching
export const getProjects = async (_req: Request, res: Response) => {
    try {
        const cachedProjects = await redisClient.get('projects_cache');
        //cache data response
        if (cachedProjects) {
            return res.json({
                message: 'Projects fetched from cache',
                projects: JSON.parse(cachedProjects)
            });
        }

        //code optimised by with limit and needed data
        const projects = await Project.findAll({
            attributes: ['id', 'name', 'description','deadline'], // Fetch only needed columns
            limit: 10,
            offset: 0
        });


        // Store in cache for 60 seconds
        await redisClient.set('projects_cache', JSON.stringify(projects), { EX: 60 }); //stored for 60 sec


        //without cache data response
        res.json({
            message: 'Projects fetched from DB',
            projects
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects', error: err });
    }
};


// Update project
export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.update({ name, description });

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('project-updated', project);

        res.json({
            message: 'Project updated successfully',
            project
        });
    } catch (err) {
        res.status(500).json({ message: 'Project update failed', error: err });
    }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.destroy();

        // Emit socket event
        const io = req.app.locals.io;
        io.emit('project-deleted', { id });

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Project deletion failed', error: err });
    }
};
