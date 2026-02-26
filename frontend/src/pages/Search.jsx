import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, getPopular } from '../api/axios.js';
import MovieCard from '../components/MovieCard.jsx';
import { FiSearch, FiX } from 'react-icons/fi';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const [query, setQuery] = useState(queryParam);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [popularMovies, setPopularMovies] = useState([]);

  // Fetch popular movies for default view
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await getPopular();
        setPopularMovies(res.data.results);
      } catch (err) {
        console.error('Failed to fetch popular:', err.message);
      }
    };
    fetchPopular();
  }, []);

  // Auto search when query param changes (from navbar search)
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      handleSearch(queryParam, 1);
    }
  }, [queryParam]);

  const handleSearch = async (searchQuery, pageNum = 1) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const res = await searchMovies(q.trim(), pageNum);
      const data = res.data;

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
      setPage(pageNum);
    } catch (err) {
      console.error('Search error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query: query.trim() });
    setPage(1);
    setMovies([]);
    handleSearch(query.trim(), 1);
  };

  const handleClear = () => {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
    setTotalResults(0);
    setSearchParams({});
  };

  const handleLoadMore = () => {
    handleSearch(query, page + 1);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ===== SEARCH HEADER ===== */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Search <span className="text-red-500">Movies</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Find your favourite movies from millions of titles
          </p>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 max-w-2xl mx-auto mb-10"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 pl-11 pr-10 py-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-600 focus:bg-[#252525] transition-all text-sm"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSearch size={16} />
            )}
            Search
          </button>
        </form>

        {/* ===== SEARCH RESULTS ===== */}
        {hasSearched && (
          <>
            {/* Results Count */}
            {!loading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  {totalResults > 0 ? (
                    <>
                      Found{' '}
                      <span className="text-white font-semibold">
                        {totalResults.toLocaleString()}
                      </span>{' '}
                      results for{' '}
                      <span className="text-red-400 font-semibold">
                        "{queryParam}"
                      </span>
                    </>
                  ) : (
                    <>
                      No results found for{' '}
                      <span className="text-red-400 font-semibold">
                        "{queryParam}"
                      </span>
                    </>
                  )}
                </p>
                {totalResults > 0 && (
                  <span className="text-gray-500 text-xs">
                    Page {page} of {totalPages}
                  </span>
                )}
              </div>
            )}

            {/* No Results */}
            {!loading && movies.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-white text-xl font-semibold mb-2">
                  No movies found
                </h3>
                <p className="text-gray-400 text-sm">
                  Try searching with different keywords
                </p>
              </div>
            )}

            {/* Results Grid */}
            {movies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={`${movie.id}-${page}`} movie={movie} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {movies.length > 0 && page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-white/10 hover:border-red-600/50 text-white font-semibold px-8 py-3 rounded-xl transition-all"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Load More Movies'
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== DEFAULT VIEW — Popular Movies ===== */}
        {!hasSearched && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              🔥 <span>Popular Right Now</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;