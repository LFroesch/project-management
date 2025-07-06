import mongoose, { Document, Schema } from 'mongoose';

// Sub-schemas for complex nested data
const todoSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const devLogSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  entry: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const docSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Model', 'Route', 'API', 'Util', 'ENV', 'Auth', 'Runtime', 'Framework'],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
  // Basic fields
  name: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  isArchived: boolean;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Notes Section
  notes: string; // Still supports markdown
  todos: Array<{
    id: string;
    text: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    createdAt: Date;
  }>;
  devLog: Array<{
    id: string;
    title: string;
    description: string;
    entry: string;
    date: Date;
  }>;
  
  // NEW: Structured Documentation Templates
  docs: Array<{
    id: string;
    type: 'Model' | 'Route' | 'API' | 'Util' | 'ENV' | 'Auth' | 'Runtime' | 'Framework';
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  
  // Settings Section
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
  
  // Notes Section
  notes: {
    type: String,
    default: ''
  },
  todos: [todoSchema],
  devLog: [devLogSchema],
  
  // NEW: Structured Documentation Templates
  docs: [docSchema],
  
  // Settings Section
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