import { Request, Response } from 'express';
import Workspace from '../models/Workspace';
import { AuthRequest } from '../types/AuthRequest';

// Create a new workspace
export const createWorkspace = async (req: AuthRequest, res: Response) => {
    const { name, brandingLogo } = req.body;
    const ownerId = req.user!.id;

    try {
        const workspace = await Workspace.create({ name, ownerId, brandingLogo });
        res.status(201).json({ message: 'Workspace created successfully', workspace });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Workspace creation failed' });
    }
};

// Get all workspaces
export const getAllWorkspaces = async (req: Request, res: Response) => {
    try {
        const workspaces = await Workspace.findAll();
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching workspaces' });
    }
};

// Update workspace name or branding
export const updateWorkspace = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, brandingLogo } = req.body;

    try {
        const workspace = await Workspace.findByPk(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        if (name) workspace.name = name;
        if (brandingLogo) workspace.brandingLogo = brandingLogo;

        await workspace.save();

        res.json({ message: 'Workspace updated', workspace });
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
};

// Delete workspace by ID
export const deleteWorkspace = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const workspace = await Workspace.findByPk(id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        await workspace.destroy();
        res.json({ message: 'Workspace deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
