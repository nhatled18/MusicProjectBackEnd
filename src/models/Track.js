import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  album: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  genre: {
    type: String,
    trim: true
  },
  coverArt: {
    type: String,
    default: null
  },
  previewUrl: {
    type: String,
    default: null
  },
  streamUrl: {
    type: String,
    default: null
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  externalIds: {
    spotify: String,
    apple: String,
    youtube: String
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

trackSchema.index({ title: 'text', artistName: 'text' });

export default mongoose.model('Track', trackSchema);