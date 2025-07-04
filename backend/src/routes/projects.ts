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

    // Add validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const project = new Project({
      name: name.trim(),
      description: description.trim(),
      notes: notes || '',
      staging: staging || '',
      roadmap: roadmap || '',
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
        isArchived: project.isArchived,
        isShared: project.isShared,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get user's projects
router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    const formattedProjects = projects.map(project => ({
      id: project._id,
      name: project.name,
      description: project.description,
      notes: project.notes,
      staging: project.staging,
      roadmap: project.roadmap,
      isArchived: project.isArchived,
      isShared: project.isShared,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    res.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ 
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        notes: project.notes,
        staging: project.staging,
        roadmap: project.roadmap,
        isArchived: project.isArchived,
        isShared: project.isShared,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Get single project error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update project
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { name, description, notes, staging, roadmap } = req.body;
    
    // Add validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        name: name.trim(), 
        description: description.trim(), 
        notes: notes || '', 
        staging: staging || '', 
        roadmap: roadmap || ''
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        notes: project.notes,
        staging: project.staging,
        roadmap: project.roadmap,
        isArchived: project.isArchived,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Archive/Unarchive project
router.patch('/:id/archive', async (req: AuthRequest, res) => {
  try {
    const { isArchived } = req.body;
    
    if (typeof isArchived !== 'boolean') {
      return res.status(400).json({ message: 'isArchived must be a boolean value' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isArchived },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: `Project ${isArchived ? 'archived' : 'unarchived'} successfully`,
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        notes: project.notes,
        staging: project.staging,
        roadmap: project.roadmap,
        isArchived: project.isArchived,
        isShared: project.isShared,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Archive project error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Delete project
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;