// backend/src/routes/follow.js
import express from 'express';
import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Theo dõi nghệ sĩ (tìm hoặc tạo mới nếu chưa có)
router.post('/', protect, async (req, res) => {
  try {
    const { name, listeners, playcount, image, mbid, url } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên nghệ sĩ không được để trống' 
      });
    }

    // Tìm artist theo tên, nếu không có thì tạo mới
    let artist = await Artist.findOne({ name: name });
    
    if (!artist) {
      // Tạo artist mới
      artist = new Artist({
        name,
        listeners: listeners || 0,
        playcount: playcount || 0,
        image: image || [],
        mbid: mbid || '',
        url: url || ''
      });
      await artist.save();
      console.log('Đã tạo artist mới:', artist.name);
    }

    // Check đã follow chưa
    if (user.followingArtists?.some(id => id.toString() === artist._id.toString())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Đã theo dõi nghệ sĩ này rồi' 
      });
    }

    // Follow
    user.followingArtists = user.followingArtists || [];
    user.followingArtists.push(artist._id);
    await user.save();

    res.json({ 
      success: true, 
      message: 'Đã theo dõi nghệ sĩ', 
      data: artist 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Bỏ theo dõi nghệ sĩ (theo tên)
router.delete('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.user;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên nghệ sĩ không được để trống' 
      });
    }

    // Tìm artist theo tên
    const artist = await Artist.findOne({ name: name });
    
    if (!artist) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy nghệ sĩ' 
      });
    }

    // Kiểm tra đã follow chưa
    if (!user.followingArtists?.some(id => id.toString() === artist._id.toString())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chưa theo dõi nghệ sĩ này' 
      });
    }

    // Unfollow
    user.followingArtists = user.followingArtists.filter(
      id => id.toString() !== artist._id.toString()
    );
    await user.save();

    res.json({ 
      success: true, 
      message: 'Đã bỏ theo dõi nghệ sĩ' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Lấy danh sách nghệ sĩ đã theo dõi
router.get('/', protect, async (req, res) => {
  try {
    const user = req.user;
    await user.populate('followingArtists');

    res.json({ 
      success: true, 
      data: user.followingArtists || [] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;