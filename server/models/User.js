import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  savedPoses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pose' }],
});

const User = mongoose.model('User', UserSchema);
export default User; 