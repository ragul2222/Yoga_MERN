import dotenv from 'dotenv';
dotenv.config();
// This file is now server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from './db.js';
import User from './models/User.js';
import Pose from './models/Pose.js';
import posesRouter from './routes/poses.js';
import usersRouter from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const JWT_SECRET = 'your_jwt_secret'; // Change this in production

// Middleware to verify JWT and get user
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Registration route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required.' });
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: 'User already exists.' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered successfully.' });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Admin registration route
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required.' });
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: 'Admin already exists.' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({ username, password: hashedPassword, role: 'admin' });
  await admin.save();
  res.status(201).json({ message: 'Admin registered successfully.' });
});

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await User.findOne({ username, role: 'admin' });
  if (!admin) return res.status(400).json({ message: 'Invalid admin credentials.' });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid admin credentials.' });
  const token = jwt.sign({ userId: admin._id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Save a pose
app.post('/api/save-pose', auth, async (req, res) => {
  const { poseId } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.savedPoses.includes(poseId)) {
    user.savedPoses.push(poseId);
    await user.save();
  }
  res.json({ savedPoses: user.savedPoses });
});

// Remove a saved pose
app.post('/api/remove-pose', auth, async (req, res) => {
  const { poseId } = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.savedPoses = user.savedPoses.filter(id => id !== poseId);
  await user.save();
  res.json({ savedPoses: user.savedPoses });
});

// Get all saved poses
app.get('/api/saved-poses', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ savedPoses: user.savedPoses });
});

// Test endpoint for DB connectivity
app.get('/api/db-test', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const poseCount = await Pose.countDocuments();
    res.json({ status: 'ok', userCount, poseCount });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// TEMP: Seed sample poses for testing
app.post('/api/seed-poses', async (req, res) => {
  try {
    const samplePoses = [
      {
        name: 'Mountain Pose',
        category: 'Beginner',
        image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'A foundational yoga pose that promotes balance and calm.',
        difficulty: 'Beginner',
      },
      {
        name: 'Downward Dog',
        category: 'Beginner',
        image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'A classic yoga pose that strengthens the whole body and stretches the back.',
        difficulty: 'Beginner',
      },
      {
        name: 'Tree Pose',
        category: 'Intermediate',
        image: 'https://images.pexels.com/photos/317155/pexels-photo-317155.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'Improves balance and stability in the legs.',
        difficulty: 'Intermediate',
      },
      {
        name: 'Wheel Pose',
        category: 'Advanced',
        image: 'https://images.pexels.com/photos/1812964/pexels-photo-1812964.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'A deep backbend that increases strength and flexibility.',
        difficulty: 'Advanced',
      },
      {
        name: 'Seated Forward Bend',
        category: 'Flexibility',
        image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'Stretches the spine, shoulders, and hamstrings.',
        difficulty: 'Beginner',
      },
      {
        name: 'Plank Pose',
        category: 'Strength',
        image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'Strengthens the arms, wrists, and spine.',
        difficulty: 'Intermediate',
      },
      {
        name: "Child's Pose",
        category: 'Relaxation',
        image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&w=400&h=300&fit=crop',
        description: 'A gentle resting pose for relaxation and stress relief.',
        difficulty: 'Beginner',
      },
    ];
    await Pose.insertMany(samplePoses);
    res.json({ message: 'Sample poses added.' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding poses', error: err.message });
  }
});

app.use('/api/poses', posesRouter);
app.use('/api/users', usersRouter);

app.listen(5000, () => console.log('Server running on http://localhost:5000')); 