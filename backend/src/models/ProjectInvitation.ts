import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IProjectInvitation extends Document {
  projectId: mongoose.Types.ObjectId;
  inviterUserId: mongoose.Types.ObjectId;
  inviteeEmail: string;
  inviteeUserId?: mongoose.Types.ObjectId; // Set when user exists
  role: 'editor' | 'viewer';
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectInvitationSchema = new Schema<IProjectInvitation>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    inviterUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviteeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    inviteeUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      required: true,
      default: 'viewer',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'cancelled'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate token
ProjectInvitationSchema.pre('save', function (next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Index for efficient queries
ProjectInvitationSchema.index({ token: 1 });
ProjectInvitationSchema.index({ inviteeEmail: 1 });
ProjectInvitationSchema.index({ inviteeUserId: 1 });
ProjectInvitationSchema.index({ projectId: 1 });
ProjectInvitationSchema.index({ expiresAt: 1 });

// Compound index to prevent duplicate pending invitations
ProjectInvitationSchema.index(
  { projectId: 1, inviteeEmail: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// TTL index to automatically clean up expired invitations after 30 days
ProjectInvitationSchema.index(
  { expiresAt: 1 }, 
  { 
    expireAfterSeconds: 30 * 24 * 60 * 60,
    partialFilterExpression: { 
      status: { $in: ['expired', 'cancelled'] }
    }
  }
);

export default mongoose.model<IProjectInvitation>('ProjectInvitation', ProjectInvitationSchema);