import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart();
  const { token, addAlert } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('cash on delivery');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      addAlert('Please sign in to place an order.', 'error');
      return;
    }

    if (cart.length === 0) {
      addAlert('Your cart is empty!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          number,
          email,
          method,
          flat,
          street,
          city,
          state,
          pinCode
        })
      });

      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Order placed successfully!', 'success');
        // Force refresh cart state in Context
        await fetchCart();
        navigate('/orders');
      } else {
        addAlert(data.message || 'Order placement failed.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container section-padding animate-fade-in" style={{ textAlign: 'center' }}>
        <h2 className="title-serif" style={{ fontSize: '32px', marginBottom: '24px' }}>Your Cart is Empty</h2>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in">
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Order Display summary */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="title-serif" style={{ fontSize: '22px', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Your Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.name} <strong style={{ color: 'var(--text-primary)' }}>x {item.quantity}</strong>
                </span>
                <span>₹{item.price * item.quantity}/-</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: 700,
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '16px'
          }}>
            <span>Grand Total :</span>
            <span style={{ color: 'var(--primary)' }}>₹{cartTotal}/-</span>
          </div>
        </div>

        {/* Placing Form details */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 className="title-serif" style={{ fontSize: '22px', marginBottom: '32px', textAlign: 'center' }}>Place Your Order</h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
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
                <label htmlFor="number">Your Phone</label>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
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
                <label htmlFor="method">Payment Method</label>
                <select
                  id="method"
                  className="form-control"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="cash on delivery">Cash on Delivery</option>
                  <option value="credit card">Credit Card</option>
                  <option value="upi id">UPI ID</option>
                  <option value="paytm">Paytm</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="flat">Flat No.</label>
                <input
                  type="text"
                  id="flat"
                  className="form-control"
                  placeholder="e.g. flat no."
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  className="form-control"
                  placeholder="e.g. colony, street, landmark"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  placeholder="e.g. indore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  className="form-control"
                  placeholder="e.g. MP"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pinCode">Pin Code</label>
                <input
                  type="number"
                  id="pinCode"
                  className="form-control"
                  placeholder="e.g. 123456"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Order Now'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
