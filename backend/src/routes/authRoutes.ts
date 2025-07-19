import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';
import { Roles } from '../constants/roles';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Admin-only user management route (example)
router.get('/admin/users', authenticateToken, authorizeRoles(Roles.ADMIN), (req, res) => {
    res.json({ message: 'Admin-only user management route' });
});

export default router;
