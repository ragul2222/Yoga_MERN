import express from 'express';
import Pose from '../models/Pose.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to check admin
function adminAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admins only' });
    req.user = user;
    next();
  });
}

// GET all poses
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/poses called');
    const poses = await Pose.find().sort({ createdAt: -1 });
    console.log('Fetched poses:', poses);
    res.json(poses);
  } catch (err) {
    console.error('Error fetching poses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new pose (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, category, image, description, difficulty } = req.body;
    const pose = new Pose({ name, category, image, description, difficulty });
    await pose.save();
    res.status(201).json(pose);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update pose (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const pose = await Pose.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pose) return res.status(404).json({ message: 'Pose not found' });
    res.json(pose);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE pose (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const pose = await Pose.findByIdAndDelete(req.params.id);
    if (!pose) return res.status(404).json({ message: 'Pose not found' });
    res.json({ message: 'Pose deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid request' });
  }
});

export default router; 