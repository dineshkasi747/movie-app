import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrending, getPopular, getTopRated, getUpcoming } from '../api/axios.js';
import MovieCard from '../components/MovieCard.jsx';
import { FiPlay, FiInfo, FiStar, FiTrendingUp, FiAward, FiCalendar } from 'react-icons/fi';

const BACKDROP_BASE = import.meta.env.VITE_TMDB_BACKDROP;
const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE;

const Home = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
          getTrending(),
          getPopular(),
          getTopRated(),
          getUpcoming(),
        ]);

        const trendingMovies = trendingRes.data.results;
        setTrending(trendingMovies);
        setPopular(popularRes.data.results);
        setTopRated(topRatedRes.data.results);
        setUpcoming(upcomingRes.data.results);

        // Pick a random trending movie for hero banner
        const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.length));
        setHero(trendingMovies[randomIndex]);
      } catch (err) {
        console.error('Failed to fetch movies:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      {/* ===== HERO BANNER ===== */}
      {hero && (
        <div className="relative h-[90vh] flex items-end pb-24 overflow-hidden">
          {/* Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${BACKDROP_BASE}${hero.backdrop_path})`,
              filter: 'brightness(0.4)',
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              {/* Badge */}
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-4">
                🔥 Trending This Week
              </span>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                {hero.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                <span className="flex items-center gap-1 text-yellow-400 font-bold text-base">
                  <FiStar />
                  {hero.vote_average?.toFixed(1)}
                </span>
                <span>{hero.release_date?.split('-')[0]}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
                  HD
                </span>
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-base leading-relaxed mb-8 line-clamp-3">
                {hero.overview}
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/movie/${hero.id}`)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-900/30"
                >
                  <FiPlay size={18} />
                  Watch Trailer
                </button>
                <button
                  onClick={() => navigate(`/movie/${hero.id}`)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-xl transition-all border border-white/10"
                >
                  <FiInfo size={18} />
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOVIE SECTIONS ===== */}
      <div className="max-w-7xl mx-auto px-6 pb-16 -mt-10 relative z-10">

        {/* Trending */}
        <MovieSection
          title="Trending This Week"
          icon={<FiTrendingUp className="text-red-500" />}
          movies={trending}
        />

        {/* Popular */}
        <MovieSection
          title="Popular Movies"
          icon={<FiStar className="text-yellow-400" />}
          movies={popular}
        />

        {/* Top Rated */}
        <MovieSection
          title="Top Rated"
          icon={<FiAward className="text-blue-400" />}
          movies={topRated}
        />

        {/* Upcoming */}
        <MovieSection
          title="Coming Soon"
          icon={<FiCalendar className="text-green-400" />}
          movies={upcoming}
        />
      </div>
    </div>
  );
};

// ===== REUSABLE MOVIE SECTION COMPONENT =====
const MovieSection = ({ title, icon, movies }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleMovies = showAll ? movies : movies.slice(0, 10);

  if (!movies.length) return null;

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          {showAll ? 'Show Less ↑' : 'See All →'}
        </button>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;