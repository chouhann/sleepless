import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [registrationCode, setRegistrationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { register, addAlert } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cpassword) {
      addAlert('Confirm password not matched!', 'error');
      return;
    }

    if (userType === 'admin' && !registrationCode) {
      addAlert('Admin pincode is required!', 'error');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password, userType, registrationCode);
    setSubmitting(false);

    if (res.success) {
      navigate('/login');
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <h3 className="title-serif" style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>Register Now</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', textAlign: 'center' }}>
          Create an account to order food and message us!
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              id="cpassword"
              className="form-control"
              placeholder="confirm your password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userType">Account Type</label>
            <select
              id="userType"
              className="form-control"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {userType === 'admin' && (
            <div className="form-group animate-fade-in">
              <label htmlFor="registrationCode">Admin Pin Code</label>
              <input
                type="password"
                id="registrationCode"
                className="form-control"
                placeholder="admin's pincode (e.g. 123ABC)"
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                required={userType === 'admin'}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '16px', marginBottom: '24px' }}
            disabled={submitting}
          >
            {submitting ? 'Registering...' : 'Register Now'}
          </button>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
