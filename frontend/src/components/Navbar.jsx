import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FiSearch, FiLogOut, FiUser, FiBookmark, FiFilm } from 'react-icons/fi';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f0f0f]/98 shadow-lg shadow-black/50'
          : 'bg-gradient-to-b from-black/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-red-600 tracking-tight hover:text-red-500 transition-colors"
        >
          🎬 CineStream
        </Link>

        {/* Nav Links - Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {[
            { path: '/', label: 'Home' },
            { path: '/search', label: 'Search' },
            { path: '/watchlist', label: 'Watchlist' },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="bg-white/10 text-white placeholder-gray-500 text-sm px-4 py-2 pl-9 rounded-full border border-white/10 focus:outline-none focus:border-red-600 focus:bg-white/15 w-48 focus:w-64 transition-all duration-300"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          </div>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Username */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
                <FiUser className="text-red-500" />
                <span>{user?.username}</span>
              </div>

              {/* Watchlist shortcut */}
              <Link
                to="/watchlist"
                className="hidden md:flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                title="Watchlist"
              >
                <FiBookmark size={18} />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              >
                <FiLogOut size={15} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2"
          >
            <div className="space-y-1">
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-white/5 px-6 py-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-red-600"
            />
            <button type="submit" className="bg-red-600 p-2 rounded-lg text-white">
              <FiSearch size={16} />
            </button>
          </form>

          {/* Mobile Links */}
          {[
            { path: '/', label: 'Home', icon: <FiFilm /> },
            { path: '/search', label: 'Search', icon: <FiSearch /> },
            { path: '/watchlist', label: 'Watchlist', icon: <FiBookmark /> },
          ].map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white py-2 transition-colors"
            >
              {icon} {label}
            </Link>
          ))}

          {/* Mobile Auth */}
          {isLoggedIn ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 text-red-500 hover:text-red-400 py-2 transition-colors"
            >
              <FiLogOut /> Logout ({user?.username})
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 bg-red-600 rounded-lg text-sm text-white font-semibold hover:bg-red-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;