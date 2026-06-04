import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { GeneratedMaterial } from '../models/GeneratedMaterial.js';
import { aiService, type GenerationMode, type DepthLevel } from '../services/aiService.js';

const router = Router();

// Middleware to verify user is authenticated
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT verification
  // For now, we'll accept userId from headers for testing
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  (req as any).userId = userId;
  next();
};

router.use(authenticateUser);

// Generate content
router.post(
  '/generate',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      subject,
      topic,
      mode,
      depthLevel = 'practitioner',
      customTopic
    } = req.body;

    if (!subject || !topic || !mode) {
      return res.status(400).json({
        error: 'Missing required fields: subject, topic, mode'
      });
    }

    try {
      // Generate content using AI service
      const result = await aiService.generateContent({
        subject,
        topic,
        mode: mode as GenerationMode,
        depthLevel: depthLevel as DepthLevel,
        customTopic
      });

      // Save to database
      const material = await GeneratedMaterial.create({
        userId: (req as any).userId,
        subject,
        topic,
        mode,
        depthLevel,
        content: result.content,
        metadata: result.metadata
      });

      res.status(201).json({
        success: true,
        data: {
          id: material._id,
          subject: material.subject,
          topic: material.topic,
          mode: material.mode,
          depthLevel: material.depthLevel,
          content: material.content,
          metadata: material.metadata,
          createdAt: material.createdAt
        }
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      res.status(500).json({
        error: 'Failed to generate content',
        message: error.message
      });
    }
  })
);

// Get user's materials
router.get(
  '/my-materials',
  asyncHandler(async (req: Request, res: Response) => {
    const { subject, mode, skip = 0, limit = 20 } = req.query;

    const filter: any = { userId: (req as any).userId };
    if (subject) filter.subject = subject;
    if (mode) filter.mode = mode;

    const materials = await GeneratedMaterial.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

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

// Get single material
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
