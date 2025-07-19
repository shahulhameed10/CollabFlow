import { Router } from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/projectController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';
import { Roles } from '../constants/roles';

const router = Router();

// Create Project - Only Admin, Owner, Manager
router.post('/', authenticateToken, authorizeRoles(Roles.ADMIN, Roles.OWNER, Roles.MANAGER), createProject);

// Get All Projects - All authenticated users
router.get('/', authenticateToken, getProjects);

// Update Project - Only Admin, Manager
router.put('/:id', authenticateToken, authorizeRoles(Roles.ADMIN, Roles.MANAGER), updateProject);

// Delete Project - Only Admin
router.delete('/:id', authenticateToken, authorizeRoles(Roles.ADMIN), deleteProject);

export default router;
