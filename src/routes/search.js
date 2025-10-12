import express from 'express';
import Track from '../models/Track.js';
import Artist from '../models/Artist.js';

const router = express.Router();

// @desc    Search tracks and artists
// @route   GET /api/search?q=query
router.get('/', async (req, res) => {
try {
  const searchQuery = req.query.q;
  const limit = parseInt(req.query.limit) || 10;

  if (!searchQuery) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập từ khóa tìm kiếm' 
    });
  }

    // Search tracks
    const tracks = await Track.find(
      { $text: { $search: searchQuery  } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .populate('artist');

    // Search artists
    const artists = await Artist.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        tracks,
        artists
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;