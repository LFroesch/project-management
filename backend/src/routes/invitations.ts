import express from 'express';
import mongoose from 'mongoose';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';
import TeamMember from '../models/TeamMember';
import ProjectInvitation from '../models/ProjectInvitation';
import Notification from '../models/Notification';
import { User } from '../models/User';
import NotificationService from '../services/notificationService';

const router = express.Router();

// GET /api/invitations/pending - Get user's pending invitations
router.get('/pending', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get invitations by email and by userId
    const invitations = await ProjectInvitation.find({
      $or: [
        { inviteeEmail: user.email.toLowerCase(), status: 'pending' },
        { inviteeUserId: userId, status: 'pending' }
      ],
      expiresAt: { $gt: new Date() }, // Not expired
    })
      .populate('projectId', 'name description color')
      .populate('inviterUserId', 'firstName lastName username displayPreference email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error('Get pending invitations error:', error);
    res.status(500).json({ message: 'Server error fetching invitations' });
  }
});

// POST /api/invitations/:token/accept - Accept invitation
router.post('/:token/accept', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { token } = req.params;
    const userId = req.userId!;

    // Find invitation
    const invitation = await ProjectInvitation.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    }).populate('projectId').populate('inviterUserId', 'firstName lastName username displayPreference');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found or expired' });
    }

    // Verify user can accept this invitation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const canAccept = invitation.inviteeEmail === user.email.toLowerCase() || 
                      invitation.inviteeUserId?.toString() === userId;

    if (!canAccept) {
      return res.status(403).json({ message: 'Cannot accept this invitation' });
    }

    // Check if user is already a team member
    const existingMember = await TeamMember.findOne({
      projectId: invitation.projectId,
      userId,
    });

    if (existingMember) {
      return res.status(400).json({ message: 'Already a team member of this project' });
    }

    // Check if user is the project owner
    const project = invitation.projectId as any;
    if (project.ownerId?.toString() === userId) {
      return res.status(400).json({ message: 'Cannot accept invitation to own project' });
    }

    // Create team membership
    const teamMember = new TeamMember({
      projectId: invitation.projectId,
      userId,
      role: invitation.role,
      invitedBy: invitation.inviterUserId,
    });

    await teamMember.save();

    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    if (!invitation.inviteeUserId) {
      invitation.inviteeUserId = new mongoose.Types.ObjectId(userId);
    }
    await invitation.save();

    // Clear the invitation notification and create acceptance notification
    await Notification.updateMany(
      { relatedInvitationId: invitation._id },
      { isRead: true }
    );

    // Notify inviter of acceptance
    const notificationService = NotificationService.getInstance();
    await notificationService.createNotification({
      userId: invitation.inviterUserId,
      type: 'team_member_added',
      title: 'Invitation Accepted',
      message: `${user.displayPreference === 'username' ? `@${user.username}` : `${user.firstName} ${user.lastName}`} accepted your invitation to "${project.name}"`,
      relatedProjectId: project._id,
      relatedUserId: userId,
    });

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        color: project.color,
      },
      role: invitation.role,
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ message: 'Server error accepting invitation' });
  }
});

// POST /api/invitations/:token/decline - Decline invitation
router.post('/:token/decline', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { token } = req.params;
    const userId = req.userId!;

    // Find invitation
    const invitation = await ProjectInvitation.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    }).populate('projectId', 'name').populate('inviterUserId', 'firstName lastName username displayPreference');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found or expired' });
    }

    // Verify user can decline this invitation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const canDecline = invitation.inviteeEmail === user.email.toLowerCase() || 
                       invitation.inviteeUserId?.toString() === userId;

    if (!canDecline) {
      return res.status(403).json({ message: 'Cannot decline this invitation' });
    }

    // Update invitation status
    invitation.status = 'cancelled';
    await invitation.save();

    // Clear the invitation notification
    await Notification.updateMany(
      { relatedInvitationId: invitation._id },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Invitation declined successfully',
    });
  } catch (error) {
    console.error('Decline invitation error:', error);
    res.status(500).json({ message: 'Server error declining invitation' });
  }
});

// GET /api/invitations/:token - Get invitation details (public, no auth required)
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await ProjectInvitation.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    })
      .populate('projectId', 'name description color')
      .populate('inviterUserId', 'firstName lastName username displayPreference');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found or expired' });
    }

    res.json({
      success: true,
      invitation: {
        id: invitation._id,
        projectName: (invitation.projectId as any).name,
        projectDescription: (invitation.projectId as any).description,
        projectColor: (invitation.projectId as any).color,
        inviterName: (invitation.inviterUserId as any).displayPreference === 'username'
          ? `@${(invitation.inviterUserId as any).username}`
          : `${(invitation.inviterUserId as any).firstName} ${(invitation.inviterUserId as any).lastName}`,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Get invitation details error:', error);
    res.status(500).json({ message: 'Server error fetching invitation details' });
  }
});

export default router;