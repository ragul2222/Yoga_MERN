import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://ragulrr:Ragul2222@cluster0.nrpdiza.mongodb.net/Yoga';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}; 