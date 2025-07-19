import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/appconfig';
import { AuthRequest } from '../types/AuthRequest';


// Custom authentication middleware to verify JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Removes "Bearer"

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest['user'];
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
