import { pool } from '../config/db.js';

// @route   POST /api/user/watchlist
// @desc    Add movie to watchlist
// @access  Protected
const addToWatchlist = async (req, res) => {
  const { movie_id, movie_title, poster_path, release_date, vote_average } = req.body;
  const user_id = req.user.id; // Coming from JWT token via authMiddleware

  // Validate required fields
  if (!movie_id || !movie_title) {
    return res.status(400).json({ message: '❌ Movie ID and title are required' });
  }

  try {
    // INSERT IGNORE won't throw error if movie already in watchlist
    await pool.query(
      `INSERT IGNORE INTO watchlist 
        (user_id, movie_id, movie_title, poster_path, release_date, vote_average) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path, release_date, vote_average]
    );

    res.status(201).json({ message: '✅ Movie added to watchlist' });
  } catch (err) {
    console.error('Add watchlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   DELETE /api/user/watchlist/:movie_id
// @desc    Remove movie from watchlist
// @access  Protected
const removeFromWatchlist = async (req, res) => {
  const { movie_id } = req.params;
  const user_id = req.user.id; // Coming from JWT token via authMiddleware

  try {
    const [result] = await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '❌ Movie not found in watchlist' });
    }

    res.json({ message: '✅ Movie removed from watchlist' });
  } catch (err) {
    console.error('Remove watchlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET /api/user/watchlist
// @desc    Get all movies in user's watchlist
// @access  Protected
const getWatchlist = async (req, res) => {
  const user_id = req.user.id; // Coming from JWT token via authMiddleware

  try {
    const [rows] = await pool.query(
      `SELECT * FROM watchlist 
       WHERE user_id = ? 
       ORDER BY added_at DESC`,
      [user_id]
    );

    res.json({
      message: '✅ Watchlist fetched successfully',
      total: rows.length,
      watchlist: rows
    });
  } catch (err) {
    console.error('Get watchlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET /api/user/watchlist/check/:movie_id
// @desc    Check if a specific movie is in user's watchlist
// @access  Protected
const checkWatchlist = async (req, res) => {
  const { movie_id } = req.params;
  const user_id = req.user.id; // Coming from JWT token via authMiddleware

  try {
    const [rows] = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [user_id, movie_id]
    );

    res.json({
      isInWatchlist: rows.length > 0
    });
  } catch (err) {
    console.error('Check watchlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET /api/user/profile
// @desc    Get logged in user profile
// @access  Protected
const getProfile = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    // Get watchlist count from Railway MySQL
    const [watchlistCount] = await pool.query(
      'SELECT COUNT(*) as total FROM watchlist WHERE user_id = ?',
      [user_id]
    );

    res.json({
      user: rows[0],
      watchlistCount: watchlistCount[0].total
    });
  } catch (err) {
    console.error('Profile error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  checkWatchlist,
  getProfile
};