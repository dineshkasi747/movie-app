import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiBookmark, FiTrash2, FiPlay,
  FiStar, FiCalendar, FiFilm
} from 'react-icons/fi';

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const Watchlist = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/watchlist' } } });
      return;
    }
    fetchWatchlist();
  }, [isLoggedIn]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await getWatchlist();
      setWatchlist(res.data.watchlist);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    setRemoving(movieId);
    try {
      await removeFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((m) => m.movie_id !== movieId));
    } catch (err) {
      console.error('Failed to remove:', err.message);
    } finally {
      setRemoving(null);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              <FiBookmark className="text-red-500" />
              My Watchlist
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Welcome back,{' '}
              <span className="text-red-400 font-semibold">{user?.username}</span>
              {' '}— you have{' '}
              <span className="text-white font-semibold">{watchlist.length}</span>
              {' '}movie{watchlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {/* Browse More */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/10 hover:border-red-600/50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <FiFilm size={16} />
            Browse Movies
          </Link>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {watchlist.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6 border border-white/5">
              <FiBookmark size={36} className="text-gray-600" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-3">
              Your watchlist is empty
            </h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">
              Start adding movies you want to watch by clicking the
              bookmark icon on any movie card
            </p>
            <Link
              to="/"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
            >
              <FiFilm size={16} />
              Discover Movies
            </Link>
          </div>
        )}

        {/* ===== WATCHLIST GRID ===== */}
        {watchlist.length > 0 && (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs mb-1">Total Movies</p>
                <p className="text-white text-2xl font-bold">{watchlist.length}</p>
              </div>
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs mb-1">Avg Rating</p>
                <p className="text-yellow-400 text-2xl font-bold flex items-center gap-1">
                  <FiStar size={18} />
                  {watchlist.length > 0
                    ? (
                        watchlist.reduce((sum, m) => sum + (parseFloat(m.vote_average) || 0), 0) /
                        watchlist.length
                      ).toFixed(1)
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5 hidden md:block">
                <p className="text-gray-500 text-xs mb-1">Last Added</p>
                <p className="text-white text-sm font-semibold truncate">
                  {watchlist[0]?.movie_title || 'N/A'}
                </p>
              </div>
            </div>

            {/* Movies List */}
            <div className="space-y-4">
              {watchlist.map((movie, index) => (
                <WatchlistItem
                  key={movie.id}
                  movie={movie}
                  index={index}
                  removing={removing}
                  onRemove={handleRemove}
                  onNavigate={() => navigate(`/movie/${movie.movie_id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ===== WATCHLIST ITEM COMPONENT =====
const WatchlistItem = ({ movie, index, removing, onRemove, onNavigate }) => {
  const isRemoving = removing === movie.movie_id;

  return (
    <div
      className={`flex items-center gap-4 bg-[#1e1e1e] hover:bg-[#252525] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all group ${
        isRemoving ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Index Number */}
      <span className="hidden md:flex w-8 text-gray-600 font-bold text-sm flex-shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Poster */}
      <div
        onClick={onNavigate}
        className="flex-shrink-0 w-14 h-20 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
      >
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={movie.movie_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
            <FiFilm className="text-gray-600" size={20} />
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="flex-1 min-w-0">
        <h3
          onClick={onNavigate}
          className="text-white font-semibold text-base truncate cursor-pointer hover:text-red-400 transition-colors mb-1"
        >
          {movie.movie_title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {movie.release_date && (
            <span className="flex items-center gap-1">
              <FiCalendar size={11} />
              {movie.release_date.split('-')[0]}
            </span>
          )}
          {movie.vote_average && (
            <span className="flex items-center gap-1 text-yellow-400">
              <FiStar size={11} />
              {parseFloat(movie.vote_average).toFixed(1)}
            </span>
          )}
          <span className="text-gray-600">
            Added {new Date(movie.added_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Watch Button */}
        <button
          onClick={onNavigate}
          className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <FiPlay size={12} />
          Details
        </button>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(movie.movie_id)}
          disabled={isRemoving}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-gray-500 transition-all border border-white/5 hover:border-red-600/30"
          title="Remove from watchlist"
        >
          {isRemoving ? (
            <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiTrash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Watchlist;