import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import trackRoutes from './routes/tracks.js';
import searchRoutes from './routes/search.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database (chỉ khi khởi động)
let dbConnected = false;
if (!dbConnected) {
  connectDB();
  dbConnected = true;
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/search', searchRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🎵 SoundWave API is running!' });
});

// ✅ Export cho Vercel serverless
export default app;

// Chỉ listen khi development local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}