import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';
import { Roles } from '../constants/roles';

const router = Router();

// Create Task - Admin, Manager, Developer
router.post('/', authenticateToken, authorizeRoles(Roles.ADMIN, Roles.MANAGER, Roles.DEVELOPER), createTask);

// Get All Tasks - All authenticated users
router.get('/', authenticateToken, getTasks);

// Update Task - Developer, Manager, Admin
router.put('/:id', authenticateToken, authorizeRoles(Roles.ADMIN, Roles.MANAGER, Roles.DEVELOPER), updateTask);

// Delete Task - Only Admin and Manager
router.delete('/:id', authenticateToken, authorizeRoles(Roles.ADMIN, Roles.MANAGER), deleteTask);

export default router;
