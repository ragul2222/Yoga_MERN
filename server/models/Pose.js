import mongoose from 'mongoose';

const PoseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  createdAt: { type: Date, default: Date.now }
});

const Pose = mongoose.model('Pose', PoseSchema);
export default Pose; 