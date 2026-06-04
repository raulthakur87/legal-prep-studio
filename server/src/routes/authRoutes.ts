import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register User
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, background, targetExams, aiProvider } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide name, email, and password'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      background: background || 'practicing-lawyer',
      targetExams: targetExams || [],
      aiProvider: aiProvider || 'claude'
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        background: user.background,
        targetExams: user.targetExams,
        aiProvider: user.aiProvider
      }
    });
  })
);

// Login User
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        background: user.background,
        targetExams: user.targetExams,
        aiProvider: user.aiProvider
      }
    });
  })
);

// Get Current User
router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          background: user.background,
          targetExams: user.targetExams,
          aiProvider: user.aiProvider
        }
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  })
);

// Update User Profile
router.put(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const { name, background, targetExams, aiProvider } = req.body;

      const user = await User.findByIdAndUpdate(
        decoded.id,
        {
          ...(name && { name }),
          ...(background && { background }),
          ...(targetExams && { targetExams }),
          ...(aiProvider && { aiProvider })
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          background: user.background,
          targetExams: user.targetExams,
          aiProvider: user.aiProvider
        }
      });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  })
);

export default router;
