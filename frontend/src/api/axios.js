import axios from 'axios';

// Base axios instance pointing to our Express backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, log user out automatically
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH ROUTES =====
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);

// ===== MOVIE ROUTES =====
export const getTrending = () => API.get('/api/movies/trending');
export const getPopular = (page = 1) => API.get(`/api/movies/popular?page=${page}`);
export const getTopRated = (page = 1) => API.get(`/api/movies/toprated?page=${page}`);
export const getUpcoming = (page = 1) => API.get(`/api/movies/upcoming?page=${page}`);
export const searchMovies = (query, page = 1) => API.get(`/api/movies/search?query=${query}&page=${page}`);
export const getMovieDetails = (id) => API.get(`/api/movies/${id}`);

// ===== USER/WATCHLIST ROUTES =====
export const getWatchlist = () => API.get('/api/user/watchlist');
export const addToWatchlist = (data) => API.post('/api/user/watchlist', data);
export const removeFromWatchlist = (movieId) => API.delete(`/api/user/watchlist/${movieId}`);
export const checkWatchlist = (movieId) => API.get(`/api/user/watchlist/check/${movieId}`);
export const getProfile = () => API.get('/api/user/profile');

export default API;