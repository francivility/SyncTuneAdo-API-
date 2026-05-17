import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import heroBg from '/hero-bg.jpg'; // your background

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

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '',
    confirm_password: '', phone_number: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
              setError('Google sign-up failed');
            } finally {
              setLoading(false);
            }
          },
          context: 'signup',
          ux_mode: 'popup',
          auto_select: false,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 280,
        });
      }
    };

    if (window.google) {
      renderGoogleButton();
    } else {
      const onLibraryLoad = () => renderGoogleButton();
      window.addEventListener('google-library-loaded', onLibraryLoad);
      return () => window.removeEventListener('google-library-loaded', onLibraryLoad);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number,
      });
      const loginRes = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      login(loginRes.data.user, loginRes.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const eyeBtnStyle = {
    position: 'absolute', right: '14px', top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#8B5E3C',
    padding: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '6px', transition: 'color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left hero panel */}
      <div style={{
        width: '45%',
        position: 'relative',
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
        <div style={{
          position: 'relative', zIndex: 2, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎶</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: '38px', color: '#fff',
            fontWeight: 700, lineHeight: 1.2, marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}>
            Join the<br />Community
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: '280px' }}>
            Create your free account and start shopping for premium musical instruments today.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: '#F5F0EB',
      }}>
        <div style={{
          width: '100%', maxWidth: '500px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
          borderRadius: '32px', border: '1.5px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '40px 36px',
        }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700,
              color: '#2D2D2D', marginBottom: '8px',
            }}>Create account</h2>
            <p style={{ fontSize: '15px', color: '#6B6B6B' }}>Join SyncTuneAdo and start shopping</p>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Full Name *
              </label>
              <input
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Juan Dela Cruz" required
                style={{
                  width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.2)',
                  border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '60px',
                  color: '#2D2D2D', fontSize: '14px', outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email *
                </label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com" required
                  style={{
                    width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.2)',
                    border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '60px',
                    color: '#2D2D2D', fontSize: '14px', outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Phone Number
                </label>
                <input
                  value={form.phone_number}
                  onChange={e => setForm({ ...form, phone_number: e.target.value })}
                  placeholder="09XXXXXXXXX"
                  style={{
                    width: '100%', padding: '12px 20px', background: 'rgba(255,255,255,0.2)',
                    border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '60px',
                    color: '#2D2D2D', fontSize: '14px', outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters" required
                  style={{
                    width: '100%', padding: '12px 20px', paddingRight: '48px',
                    background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
                    borderRadius: '60px', color: '#2D2D2D', fontSize: '14px', outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtnStyle}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  placeholder="Re-enter password" required
                  style={{
                    width: '100%', padding: '12px 20px', paddingRight: '48px',
                    background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
                    borderRadius: '60px', color: '#2D2D2D', fontSize: '14px', outline: 'none',
                  }}
                  onFocus={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                  onBlur={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtnStyle}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {form.confirm_password && (
                <span style={{
                  fontSize: '11px', fontWeight: 700, marginTop: '6px', display: 'block',
                  color: form.password === form.confirm_password ? '#22c55e' : '#ef4444',
                }}>
                  {form.password === form.confirm_password ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>

            {error && (
              <div style={{
                background: 'rgba(153,27,27,0.9)', borderRadius: '60px', padding: '10px 16px',
                color: '#fff', fontSize: '13px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700,
                borderRadius: '60px', background: 'linear-gradient(135deg, #C3996B, #8B5E3C)',
                color: '#fff', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
            <span style={{ color: '#888', fontSize: '13px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#ccc' }} />
          </div>

          {/* 🔵 Google Sign-Up button rendered immediately */}
          <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }}></div>

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B6B' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#C3996B', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}