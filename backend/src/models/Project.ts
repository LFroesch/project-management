import mongoose, { Document, Schema } from 'mongoose';

// Sub-schemas for complex nested data
const todoSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const devLogSchema = new Schema({
  id: { type: String, required: true },
  entry: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const phaseSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  startDate: { type: Date },
  endDate: { type: Date }
});

const linkSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['github', 'demo', 'docs', 'other'],
    default: 'other'
  }
});

export interface IProject extends Document {
  // Existing fields
  name: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  isArchived: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Enhanced Notes Section
  notes: string; // Now supports markdown
  goals: string;
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
  }>;
  devLog: Array<{
    id: string;
    entry: string;
    date: Date;
  }>;
  
  // Enhanced Roadmap Section
  roadmap: string;
  phases: Array<{
    id: string;
    name: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed';
    startDate?: Date;
    endDate?: Date;
  }>;
  
  // Enhanced Documentation Section
  apiDocs: string;
  technicalDocs: string;
  userDocs: string;
  codeDocs: string;
  
  // Enhanced Settings Section
  stagingEnvironment: 'development' | 'staging' | 'production';
  links: Array<{
    id: string;
    title: string;
    url: string;
    type: 'github' | 'demo' | 'docs' | 'other';
  }>;
  color: string;
  category: string;
  tags: string[];
}

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Enhanced Notes Section
  notes: {
    type: String,
    default: ''
  },
  goals: {
    type: String,
    default: ''
  },
  todos: [todoSchema],
  devLog: [devLogSchema],
  
  // Enhanced Roadmap Section
  roadmap: {
    type: String,
    default: ''
  },
  phases: [phaseSchema],
  
  // Enhanced Documentation Section
  apiDocs: {
    type: String,
    default: ''
  },
  technicalDocs: {
    type: String,
    default: ''
  },
  userDocs: {
    type: String,
    default: ''
  },
  codeDocs: {
    type: String,
    default: ''
  },
  
  // Enhanced Settings Section
  stagingEnvironment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'development'
  },
  links: [linkSchema],
  color: {
    type: String,
    default: '#3B82F6' // Default blue
  },
  category: {
    type: String,
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Existing fields
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isShared: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>('Project', projectSchema);