import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { GeneratedMaterial } from '../models/GeneratedMaterial.js';
import { LEGAL_SUBJECTS, GENERATION_MODES, DEPTH_LEVELS } from '../data/subjects.js';

const router = Router();

// Middleware to verify JWT and attach user to request
const authenticateUser = (req: Request, res: Response, next: any) => {
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
};

router.use(authenticateUser);

// Get available subjects
router.get(
  '/subjects',
  asyncHandler(async (req: Request, res: Response) => {
    const subjects = Object.entries(LEGAL_SUBJECTS).map(([key, value]) => ({
      id: key,
      name: value.name,
      topicsCount: value.topics.length
    }));

    res.json({
      success: true,
      data: subjects
    });
  })
);

// Get topics for a subject
router.get(
  '/subjects/:subject/topics',
  asyncHandler(async (req: Request, res: Response) => {
    const { subject } = req.params;
    const subjectData = LEGAL_SUBJECTS[subject as keyof typeof LEGAL_SUBJECTS];

    if (!subjectData) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({
      success: true,
      data: {
        subject,
        name: subjectData.name,
        topics: subjectData.topics
      }
    });
  })
);

// Get generation modes
router.get(
  '/modes',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: GENERATION_MODES
    });
  })
);

// Get depth levels
router.get(
  '/depth-levels',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: DEPTH_LEVELS
    });
  })
);

// Get user's generated materials
router.get(
  '/user-materials',
  asyncHandler(async (req: Request, res: Response) => {
    const { subject, mode, skip = 0, limit = 20 } = req.query;

    const filter: any = { userId: (req as any).userId };
    if (subject) filter.subject = subject;
    if (mode) filter.mode = mode;

    const materials = await GeneratedMaterial.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select('-content'); // Don't include full content in list

    const total = await GeneratedMaterial.countDocuments(filter);

    res.json({
      success: true,
      data: materials,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  })
);

// Get single material by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const material = await GeneratedMaterial.findOne({
      _id: req.params.id,
      userId: (req as any).userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({
      success: true,
      data: material
    });
  })
);

// Update material
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const material = await GeneratedMaterial.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: (req as any).userId
      },
      { content },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({
      success: true,
      data: material
    });
  })
);

// Delete material
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const material = await GeneratedMaterial.findOneAndDelete({
      _id: req.params.id,
      userId: (req as any).userId
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  })
);

export default router;
