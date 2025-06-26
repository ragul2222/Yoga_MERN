import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

// GET all users
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('GET /api/users called by:', req.user);
    const users = await User.find({}, '-password'); // Exclude password
    console.log('Fetched users:', users);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST add user
router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'All fields required.' });
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User added.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update user
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const update = { username, role };
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true, context: 'query' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid request' });
  }
});

export default router; 