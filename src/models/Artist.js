import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  genres: [{
    type: String,
    trim: true
  }],
  followers: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  externalIds: {
    spotify: String,
    lastfm: String,
    apple: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

artistSchema.index({ name: 'text' });

export default mongoose.model('Artist', artistSchema);