import express from 'express';
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  getMovieDetails
} from '../controllers/movieController.js';

const router = express.Router();

// @GET /api/movies/trending
router.get('/trending', getTrending);

// @GET /api/movies/popular?page=1
router.get('/popular', getPopular);

// @GET /api/movies/toprated?page=1
router.get('/toprated', getTopRated);

// @GET /api/movies/upcoming?page=1
router.get('/upcoming', getUpcoming);

// @GET /api/movies/search?query=batman&page=1
router.get('/search', searchMovies);

// @GET /api/movies/:id  ← must be last to avoid conflicts
router.get('/:id', getMovieDetails);

export default router;