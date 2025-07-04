import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-manager';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', mongoUri.replace(/:[^:@]*@/, ':****@')); // Hide password
    
    await mongoose.connect(mongoUri);
    
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};