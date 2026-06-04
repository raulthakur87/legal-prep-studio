import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../middleware/auth.js';
import { GeneratedMaterial } from '../models/GeneratedMaterial.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Get all materials for user with filters
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { subject, mode, depthLevel, skip = 0, limit = 20 } = req.query;
    const userId = (req as any).userId;

    const filter: any = { userId };
    if (subject) filter.subject = subject;
    if (mode) filter.mode = mode;
    if (depthLevel) filter.depthLevel = depthLevel;

    const materials = await GeneratedMaterial.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

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

// Get material by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const material = await GeneratedMaterial.findOne({
      _id: req.params.id,
      userId
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

// Get materials by subject
router.get(
  '/subject/:subject',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { skip = 0, limit = 20 } = req.query;

    const materials = await GeneratedMaterial.find({
      userId,
      subject: req.params.subject
    })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await GeneratedMaterial.countDocuments({
      userId,
      subject: req.params.subject
    });

    res.json({
      success: true,
      data: materials,
      pagination: {
        total,
        skip: Number(skip),
        limit: Number(limit)
      }
    });
  })
);

// Update material
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { content, metadata } = req.body;

    const material = await GeneratedMaterial.findOneAndUpdate(
      {
        _id: req.params.id,
        userId
      },
      {
        ...(content && { content }),
        ...(metadata && { metadata })
      },
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
    const userId = (req as any).userId;
    const material = await GeneratedMaterial.findOneAndDelete({
      _id: req.params.id,
      userId
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

// Get statistics for user
router.get(
  '/stats/summary',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    const totalMaterials = await GeneratedMaterial.countDocuments({ userId });
    
    const byMode = await GeneratedMaterial.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: '$mode', count: { $sum: 1 } } }
    ]);

    const bySubject = await GeneratedMaterial.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: '$subject', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalMaterials,
        byMode: byMode.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        bySubject: bySubject.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  })
);

export default router;
