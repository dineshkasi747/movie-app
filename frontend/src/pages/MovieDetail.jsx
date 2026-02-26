import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, addToWatchlist, removeFromWatchlist, checkWatchlist } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import TrailerModal from '../components/TrailerModal.jsx';
import MovieCard from '../components/MovieCard.jsx';
import {
  FiPlay, FiBookmark, FiStar, FiClock,
  FiCalendar, FiArrowLeft
} from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

const BACKDROP_BASE = import.meta.env.VITE_TMDB_BACKDROP;
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await getMovieDetails(id);
        setMovie(res.data);

        // Check if movie is in watchlist
        if (isLoggedIn) {
          const watchlistRes = await checkWatchlist(id);
          setInWatchlist(watchlistRes.data.isInWatchlist);
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    // Scroll to top when movie changes
    window.scrollTo(0, 0);
  }, [id, isLoggedIn]);

  const handleWatchlist = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await addToWatchlist({
          movie_id: movie.id,
          movie_title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error('Watchlist error:', err.message);
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading movie details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">😕 {error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      {/* ===== BACKDROP HERO ===== */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})`,
            filter: 'brightness(0.35)',
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 z-10 flex items-center gap-2 text-gray-400 hover:text-white bg-black/30 hover:bg-black/60 px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
        >
          <FiArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* ===== MOVIE DETAILS ===== */}
      <div className="max-w-7xl mx-auto px-6 -mt-72 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_BASE}${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={movie.title}
              className="w-48 md:w-64 rounded-2xl shadow-2xl shadow-black/80 border border-white/5"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-32">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-gray-400 italic text-base mb-4">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                <FiStar />
                {movie.vote_average?.toFixed(1)}
                <span className="text-gray-500 text-sm font-normal">
                  ({movie.vote_count?.toLocaleString()} votes)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                {runtime}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {movie.release_date}
              </span>
              {movie.status && (
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-0.5 rounded-full text-xs">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Play Trailer Button */}
              {movie.trailers?.length > 0 ? (
                <button
                  onClick={() => setSelectedTrailer(movie.trailers[0])}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-900/30"
                >
                  <FiPlay size={18} />
                  Play Trailer
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 bg-gray-700 text-gray-400 font-bold px-8 py-3 rounded-xl cursor-not-allowed"
                >
                  <FiPlay size={18} />
                  No Trailer Available
                </button>
              )}

              {/* Watchlist Button */}
              <button
                onClick={handleWatchlist}
                disabled={watchlistLoading}
                className={`flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all border ${
                  inWatchlist
                    ? 'bg-red-600/20 border-red-600 text-red-400 hover:bg-red-600/30'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {inWatchlist ? <FaBookmark size={16} /> : <FiBookmark size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {movie.budget > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-gray-500 text-xs mb-1">Budget</p>
                  <p className="text-white font-semibold">
                    ${movie.budget?.toLocaleString()}
                  </p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-gray-500 text-xs mb-1">Revenue</p>
                  <p className="text-white font-semibold">
                    ${movie.revenue?.toLocaleString()}
                  </p>
                </div>
              )}
              {movie.original_language && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-gray-500 text-xs mb-1">Language</p>
                  <p className="text-white font-semibold uppercase">
                    {movie.original_language}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== ALL TRAILERS ===== */}
        {movie.trailers?.length > 1 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <FiPlay className="text-red-500" />
              Trailers & Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {movie.trailers.map((trailer) => (
                <div
                  key={trailer.key}
                  onClick={() => setSelectedTrailer(trailer)}
                  className="relative group cursor-pointer rounded-xl overflow-hidden bg-[#1e1e1e] border border-white/5 hover:border-red-600/50 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                    alt={trailer.name}
                    className="w-full aspect-video object-cover group-hover:brightness-75 transition-all"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="w-14 h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl">
                      <FiPlay className="text-white" size={22} />
                    </div>
                  </div>
                  {/* Label */}
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{trailer.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{trailer.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CAST ===== */}
        {movie.cast?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">🎭 Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.cast.map((member) => (
                <div
                  key={member.cast_id}
                  className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
                >
                  <img
                    src={
                      member.profile_path
                        ? `${IMAGE_BASE}${member.profile_path}`
                        : 'https://via.placeholder.com/150x225?text=No+Photo'
                    }
                    alt={member.name}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-2">
                    <p className="text-white text-xs font-semibold truncate">{member.name}</p>
                    <p className="text-gray-500 text-xs truncate">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SIMILAR MOVIES ===== */}
        {movie.similar?.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">🎬 Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movie.similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== TRAILER MODAL ===== */}
      {selectedTrailer && (
        <TrailerModal
          trailer={selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </div>
  );
};

export default MovieDetail;