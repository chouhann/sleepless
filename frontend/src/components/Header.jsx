import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ChefHat, ShoppingCart, User, LogOut, Menu, X, Shield } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="header-nav">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="logo title-serif">
          <ChefHat className="logo-icon" size={28} />
          <span>Sleepless</span>
        </Link>

        {/* Links based on role */}
        <div className="nav-links">
          {user && user.userType === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Dashboard</NavLink>
              <NavLink to="/admin/products" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Dishes</NavLink>
              <NavLink to="/admin/orders" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Orders</NavLink>
              <NavLink to="/admin/users" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Users</NavLink>
              <NavLink to="/admin/messages" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Messages</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Home</NavLink>
              <NavLink to="/shop" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Shop</NavLink>
              <NavLink to="/about" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>About</NavLink>
              <NavLink to="/contact" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>Contact</NavLink>
              {user && (
                <NavLink to="/orders" className={({ active }) => (active ? 'nav-link active' : 'nav-link')}>My Orders</NavLink>
              )}
            </>
          )}
        </div>

        {/* Actions / User controls */}
        <div className="nav-actions">
          {/* Cart Icon for users only */}
          {(!user || user.userType !== 'admin') && (
            <Link to="/cart" className="icon-badge-btn" title="Shopping Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
          )}

          {/* User profile details */}
          {user ? (
            <div className="profile-menu" ref={dropdownRef}>
              <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <User size={18} />
                <span>{user.name}</span>
                {user.userType === 'admin' && <Shield size={14} className="logo-icon" />}
              </div>

              {dropdownOpen && (
                <div className="profile-dropdown glass-panel">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-name">{user.name}</div>
                    <div className="profile-dropdown-email">{user.email}</div>
                  </div>
                  {user.userType === 'admin' ? (
                    <Link to="/admin/dashboard" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Shield size={16} /> Admin Panel
                    </Link>
                  ) : (
                    <Link to="/orders" className="profile-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      My Orders
                    </Link>
                  )}
                  <div className="profile-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
