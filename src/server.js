import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import trackRoutes from './routes/tracks.js';
import searchRoutes from './routes/search.js';
import favoriteRoutes from './routes/favorite.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // dev Vite
    'http://localhost:3000', // nếu cần
    'https://music-project-frontend.vercel.app' // production frontend
  ],
  credentials: true
}));
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
app.use('/api/favorites', favoriteRoutes);

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