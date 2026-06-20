import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      if (res.userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h3 className="title-serif" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>Login Now</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>
          Welcome back! Access your gourmet account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginBottom: '24px' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Login Now'}
          </button>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
