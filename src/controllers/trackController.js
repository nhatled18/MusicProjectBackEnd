import Track from '../models/Track.js';

// @desc    Get all tracks
// @route   GET /api/tracks
export const getTracks = async (req, res) => {
  try {
    const { genre, limit = 50, page = 1 } = req.query;
    
    const query = genre ? { genre } : {};
    
    const tracks = await Track.find(query)
      .populate('artist')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ playCount: -1 });

    const count = await Track.countDocuments(query);

    res.json({
      success: true,
      data: tracks,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get track by ID
// @route   GET /api/tracks/:id
export const getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id).populate('artist');
    
    if (!track) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài hát' });
    }

    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create track (Admin)
// @route   POST /api/tracks
export const createTrack = async (req, res) => {
  try {
    const track = await Track.create(req.body);
    res.status(201).json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update play count
// @route   PUT /api/tracks/:id/play
export const playTrack = async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};