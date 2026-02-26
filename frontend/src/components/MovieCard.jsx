import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { addToWatchlist, removeFromWatchlist } from '../api/axios.js';
import { FiPlay, FiBookmark, FiStar } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const MovieCard = ({ movie, isInWatchlist = false, onWatchlistChange }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [saved, setSaved] = useState(isInWatchlist);
  const [loading, setLoading] = useState(false);

  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
  } = movie;

  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const imageUrl = poster_path ? `${IMAGE_BASE}${poster_path}` : null;

  const handleWatchlist = async (e) => {
    e.stopPropagation(); // Prevent navigating to movie detail

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        await removeFromWatchlist(id);
        setSaved(false);
        onWatchlistChange && onWatchlistChange(id, false);
      } else {
        await addToWatchlist({
          movie_id: id,
          movie_title: title,
          poster_path,
          release_date,
          vote_average,
        });
        setSaved(true);
        onWatchlistChange && onWatchlistChange(id, true);
      }
    } catch (err) {
      console.error('Watchlist error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => navigate(`/movie/${id}`);

  return (
    <div
      onClick={handleClick}
      className="relative group rounded-xl overflow-hidden bg-[#1e1e1e] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60"
      style={{ aspectRatio: '2/3' }}
    >
      {/* Movie Poster */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-600 text-sm text-center p-4 gap-2">
          <FiPlay size={32} />
          <span>{title}</span>
        </div>
      )}

      {/* Rating Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
        <FiStar size={10} />
        {rating}
      </div>

      {/* Watchlist Button */}
      <button
        onClick={handleWatchlist}
        disabled={loading}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          saved
            ? 'bg-red-600 text-white'
            : 'bg-black/70 backdrop-blur-sm text-white hover:bg-red-600'
        }`}
        title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {saved ? <FaBookmark size={12} /> : <FiBookmark size={12} />}
      </button>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">

        {/* Title */}
        <h3 className="text-white text-sm font-semibold leading-tight mb-1">
          {title}
        </h3>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>{year}</span>
          <span className="flex items-center gap-1 text-yellow-400 font-bold">
            <FiStar size={10} />
            {rating}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Play / Details Button */}
          <button
            onClick={handleClick}
            className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-all"
          >
            <FiPlay size={12} />
            Details
          </button>

          {/* Watchlist Button */}
          <button
            onClick={handleWatchlist}
            disabled={loading}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              saved
                ? 'bg-red-600 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
          >
            {saved ? <FaBookmark size={12} /> : <FiBookmark size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;