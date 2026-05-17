import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import heroBg from '../assets/admin-bg.jpg';   // your background image

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      if (user.role !== 'admin') {
        setError('Access denied. Admin accounts only.');
        return;
      }
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      const { token, user } = res.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundPosition: 'center 30%',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* Glass card – exact original design */}
      <div className="relative z-20 w-full max-w-[480px] bg-white/20 backdrop-blur-lg rounded-[32px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-12 text-center">
        {/* Music icon */}
        <div className="w-[72px] h-[72px] mx-auto mb-5 bg-gradient-to-br from-accent to-accent-dk rounded-[20px] flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
          🎵
        </div>

        <h1 className="font-playfair text-[34px] font-bold text-[#FAF5E9] mb-2 drop-shadow-lg">
          Admin Sign In
        </h1>
        <p className="text-[15px] text-white/80 mb-8">
          Enter your admin credentials to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* Email field */}
          <div className="mb-5 text-left">
            <label className="block text-xs font-semibold text-white/90 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@synctuneado.com"
              required
              className="w-full px-5 py-3 bg-white/20 border border-white/30 rounded-full text-white text-sm outline-none transition-all duration-200 placeholder-white/50 focus:bg-white/30"
            />
          </div>

          {/* Password field */}
          <div className="mb-7 text-left">
            <label className="block text-xs font-semibold text-white/90 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3 pr-12 bg-white/20 border border-white/30 rounded-full text-white text-sm outline-none transition-all duration-200 placeholder-white/50 focus:bg-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-accent-dk hover:text-accent transition-colors"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-900/85 border border-white/20 rounded-full px-4 py-2.5 text-white text-[13px] flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-[15px] font-bold rounded-full bg-gradient-to-r from-accent to-accent-dk text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Google Sign-In button */}
        <div className="mt-8 flex justify-center">
          {googleLoading ? (
            <div className="text-white text-sm animate-pulse">Signing in with Google...</div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed.')}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="100%"
            />
          )}
        </div>

        {/* Footer text */}
        <p className="mt-7 text-[13px] text-white/60 text-center">
          This portal is for authorized administrators only.
        </p>
      </div>
    </div>
  );
}