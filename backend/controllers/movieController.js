import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// @route   GET /api/movies/trending
// @desc    Get trending movies this week
// @access  Public
const getTrending = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${TMDB_BASE}/trending/movie/week?api_key=${API_KEY}`
    );
    res.json(data);
  } catch (err) {
    console.error('Trending error:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch trending movies' });
  }
};

// @route   GET /api/movies/popular
// @desc    Get popular movies (paginated)
// @access  Public
const getPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await axios.get(
      `${TMDB_BASE}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    res.json(data);
  } catch (err) {
    console.error('Popular error:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch popular movies' });
  }
};

// @route   GET /api/movies/toprated
// @desc    Get top rated movies
// @access  Public
const getTopRated = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await axios.get(
      `${TMDB_BASE}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );
    res.json(data);
  } catch (err) {
    console.error('Top rated error:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch top rated movies' });
  }
};

// @route   GET /api/movies/upcoming
// @desc    Get upcoming movies
// @access  Public
const getUpcoming = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { data } = await axios.get(
      `${TMDB_BASE}/movie/upcoming?api_key=${API_KEY}&page=${page}`
    );
    res.json(data);
  } catch (err) {
    console.error('Upcoming error:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch upcoming movies' });
  }
};

// @route   GET /api/movies/search?query=batman&page=1
// @desc    Search movies by name
// @access  Public
const searchMovies = async (req, res) => {
  const { query, page = 1 } = req.query;

  if (!query) {
    return res.status(400).json({ message: '❌ Search query is required' });
  }

  try {
    const { data } = await axios.get(
      `${TMDB_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    res.json(data);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: '❌ Failed to search movies' });
  }
};

// @route   GET /api/movies/:id
// @desc    Get full movie details + cast + trailer
// @access  Public
const getMovieDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch movie details, credits and videos (trailers) all at once
    const [details, credits, videos, similar] = await Promise.all([
      axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/videos?api_key=${API_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/similar?api_key=${API_KEY}`)
    ]);

    // Filter only YouTube trailers from TMDB videos
    const trailers = videos.data.results.filter(
      (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
    );

    res.json({
      ...details.data,
      cast: credits.data.cast.slice(0, 10),   // Top 10 cast members
      crew: credits.data.crew.slice(0, 5),    // Top 5 crew members
      trailers,                                // YouTube trailers array
      similar: similar.data.results.slice(0, 8) // 8 similar movies
    });
  } catch (err) {
    console.error('Movie details error:', err.message);
    res.status(500).json({ message: '❌ Failed to fetch movie details' });
  }
};

export {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  getMovieDetails
};