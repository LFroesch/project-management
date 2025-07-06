import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, theme } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      theme: theme || 'cyberpunk'
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only over HTTPS in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Check auth status
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',  
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// NEW: Update user theme
router.patch('/theme', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { theme } = req.body;
    
    const validThemes = [
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
      "synthwave", "retro", "cyberpunk", "valentine", "halloween", 
      "garden", "forest", "aqua", "lofi", "pastel", "fantasy", 
      "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
      "business", "acid", "lemonade", "night", "coffee", "winter", "dim"
    ];

    if (!validThemes.includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { theme },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Theme updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;