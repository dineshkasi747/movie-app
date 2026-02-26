import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiUser, FiMail, FiLock, FiEye,
  FiEyeOff, FiUserPlus, FiCheck
} from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Too Short', color: 'bg-red-500', width: 'w-1/4' };
    if (password.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: 'w-2/4' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    // Validations
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(username, email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 pt-16 pb-10">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 shadow-2xl shadow-black/50 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-extrabold text-red-600 tracking-tight">
              🎬 CineStream
            </Link>
            <h2 className="text-2xl font-bold text-white mt-4 mb-1">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">
              Join CineStream and start building your watchlist
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/10 border border-red-600/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full bg-[#252525] text-white placeholder-gray-600 pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-red-600 focus:bg-[#2a2a2a] transition-all text-sm"
                />
                {/* Green check when valid */}
                {formData.username.length >= 3 && (
                  <FiCheck
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    size={16}
                  />
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#252525] text-white placeholder-gray-600 pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-red-600 focus:bg-[#2a2a2a] transition-all text-sm"
                />
                {/* Green check when valid email */}
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <FiCheck
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                    size={16}
                  />
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#252525] text-white placeholder-gray-600 pl-10 pr-11 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-red-600 focus:bg-[#2a2a2a] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    strength.label === 'Strong' ? 'text-green-500' :
                    strength.label === 'Fair' ? 'text-yellow-500' :
                    strength.label === 'Weak' ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  size={16}
                />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full bg-[#252525] text-white placeholder-gray-600 pl-10 pr-11 py-3 rounded-xl border transition-all text-sm focus:outline-none focus:bg-[#2a2a2a] ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-600/60 focus:border-red-600'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-600/60 focus:border-green-600'
                      : 'border-white/10 focus:border-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {formData.password === formData.confirmPassword
                    ? '✓ Passwords match'
                    : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <FiUserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6 text-gray-600 text-xs">
          <Link to="/" className="hover:text-gray-400 transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;