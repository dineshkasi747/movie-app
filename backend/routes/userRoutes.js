import express from 'express';
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  checkWatchlist,
  getProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @GET  /api/user/profile
router.get('/profile', protect, getProfile);

// @GET  /api/user/watchlist
router.get('/watchlist', protect, getWatchlist);

// @POST /api/user/watchlist
router.post('/watchlist', protect, addToWatchlist);

// @GET  /api/user/watchlist/check/:movie_id
router.get('/watchlist/check/:movie_id', protect, checkWatchlist);

// @DELETE /api/user/watchlist/:movie_id
router.delete('/watchlist/:movie_id', protect, removeFromWatchlist);

export default router;