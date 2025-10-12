import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: '🎵'
  },
  color: {
    type: String,
    default: '#667eea'
  },
  description: {
    type: String,
    default: ''
  },
  trackCount: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Genre', genreSchema);