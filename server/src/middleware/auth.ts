import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware to verify JWT and attach user to request
export const verifyToken = asyncHandler(async (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
