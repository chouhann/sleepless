import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-column">
            <h3 className="title-serif" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat style={{ color: 'var(--primary)' }} size={24} /> Sleepless
            </h3>
            <p style={{ marginTop: '16px' }}>
              Savor the symphony of flavors that dance upon the palate, a culinary masterpiece that whispers poetry to the taste buds.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Extra Links */}
          <div className="footer-column">
            <h3>Extra Links</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
          </div>

          {/* Contact Col */}
          <div className="footer-column">
            <h3>Contact Info</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} style={{ color: 'var(--primary)' }} /> +111-222-3333</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} style={{ color: 'var(--primary)' }} /> sleepless@gmail.com</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} style={{ color: 'var(--primary)' }} /> Indore, India - 452001</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sleepless. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
