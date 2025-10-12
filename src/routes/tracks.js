import express from 'express';
import { getTracks, getTrack, createTrack, playTrack } from '../controllers/trackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTracks)
  .post(protect, createTrack);

router.route('/:id')
  .get(getTrack);

router.put('/:id/play', playTrack);

export default router;