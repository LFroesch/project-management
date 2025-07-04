import express from 'express';
import { Project } from '../models/Project';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create project
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description, notes, staging, roadmap } = req.body;

    const project = new Project({
      name,
      description,
      notes,
      staging,
      roadmap,
      userId: req.userId
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        notes: project.notes,
        staging: project.staging,
        roadmap: project.roadmap,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user's projects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;