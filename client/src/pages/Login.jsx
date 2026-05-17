import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import adminBg from '/admin-bg.jpg'; // your background

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const renderGoogleButton = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            setError('');
            setLoading(true);
            try {
              const res = await api.post('/api/auth/google', {
                credential: response.credential,
              });
              login(res.data.user, res.data.token);
              navigate('/dashboard');
            } catch (err) {
              setError('Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
          context: 'signin',
          ux_mode: 'popup',
          auto_select: false,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 280,
        });
      }
    };

    if (window.google) {
      renderGoogleButton();
    } else {
      // Listen for the custom event from index.html
      const onLibraryLoad = () => renderGoogleButton();
      window.addEventListener('google-library-loaded', onLibraryLoad);
      return () => window.removeEventListener('google-library-loaded', onLibraryLoad);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const eyeBtnStyle = {
    position: 'absolute', right: '14px', top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--accent-dk)',
    padding: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '6px', transition: 'color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${adminBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
      <div style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: '480px',
        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)',
        borderRadius: '32px', border: '1.5px solid rgba(255,255,255,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '48px 40px', textAlign: 'center',
      }}>
        <div style={{
          width: '72px', height: '72px', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dk))',
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}>🎵</div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontSize: '34px', fontWeight: 700,
          color: '#FAF5E9', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>Sign In</h1>
        <p style={{ fontSize: '15px', color: 'rgba(250,245,233,0.8)', marginBottom: '32px' }}>
          Sign in to your account
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(250,245,233,0.9)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              style={{
                width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.2)',
                border: '1.5px solid rgba(238, 212, 212, 0.3)', borderRadius: '60px',
                color: '#fff', fontSize: '14px', outline: 'none', transition: 'all 0.2s',
              }}
              onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            />
          </div>

          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(250,245,233,0.9)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 20px', paddingRight: '48px',
                  background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.3)',
                  borderRadius: '60px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                }}
                onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(153,27,27,0.85)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '60px', padding: '10px 16px', color: '#fff', fontSize: '13px',
              marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700,
              borderRadius: '60px', background: 'linear-gradient(135deg, var(--accent), var(--accent-dk))',
              color: '#fff', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' }} />
        </div>

        {/* 🔵 Google Sign-In button rendered immediately */}
        <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }}></div>

        <p style={{ marginTop: '28px', fontSize: '14px', color: 'rgba(250,245,233,0.7)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#C3996B', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}