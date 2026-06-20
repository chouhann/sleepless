import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { token, addAlert } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      addAlert('Please sign in to send messages!', 'error');
      return;
    }

    if (!name || !email || !number || !message) {
      addAlert('Please fill in all fields!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, number, message })
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Message sent successfully!', 'success');
        setName('');
        setEmail('');
        setNumber('');
        setMessage('');
      } else {
        addAlert(data.message || 'Could not send message.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(rgba(19, 27, 46, 0.9), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1200") center/cover no-repeat',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <h2 className="title-serif" style={{ fontSize: '36px', marginBottom: '8px' }}>Contact Us</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home / Contact</p>
      </div>

      {/* Grid */}
      <div className="container section-padding" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px' }}>
        
        {/* Info Col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <h3 className="title-serif gradient-text" style={{ fontSize: '28px', marginBottom: '16px' }}>Get In Touch</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Have any queries, suggestions, or custom culinary requests? Reach out to us directly and our hospitality specialists will get back to you shortly.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="glass-panel" style={{ padding: '12px', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                <Phone size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Call Us</h4>
                <p style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>+111-222-3333</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="glass-panel" style={{ padding: '12px', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Email Support</h4>
                <p style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>sleepless@gmail.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="glass-panel" style={{ padding: '12px', color: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Our Address</h4>
                <p style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>Indore, India - 452001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 className="title-serif" style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Send Us a Message</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
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
              <label htmlFor="number">Contact Number</label>
              <input
                type="number"
                id="number"
                className="form-control"
                placeholder="enter your number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="4"
                className="form-control"
                placeholder="enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={submitting}>
              {submitting ? 'Sending...' : <><Send size={16} /> Send Message</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
