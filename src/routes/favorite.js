import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

/**
 * ✅ Thêm hoặc xóa bài hát khỏi danh sách yêu thích (favorites)
 * @route POST /favorites/:userId
 * @body  { trackId: string }
 */
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { trackId } = req.body;
    
    if (!trackId)
      return res.status(400).json({ message: 'trackId là bắt buộc' });

    if (!mongoose.Types.ObjectId.isValid(trackId))
      return res.status(400).json({ message: 'trackId không hợp lệ' });

  
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User không tồn tại' });

    
    const isFavorite = user.favorites.some(
      fav => fav.toString() === trackId
    );

    if (isFavorite) {
      
      user.favorites = user.favorites.filter(
        fav => fav.toString() !== trackId
      );
    } else {
      
      user.favorites.push(new mongoose.Types.ObjectId(trackId));
    }

    await user.save();

    
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'favorites',
        select: 'title artistName album genre coverArt duration previewUrl streamUrl',
      })
      .lean();

    res.json({
      message: isFavorite
        ? 'Removed from favorites'
        : 'Added to favorites',
      favorites: updatedUser.favorites,
    });
  } catch (err) {
    console.error('Error updating favorites:', err);
    res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
});

export default router;
