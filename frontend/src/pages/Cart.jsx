import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = (item, val) => {
    if (val < 1) return;
    updateQuantity(item.id, val);
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Your Cart</h2>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <ShoppingBag size={64} style={{ color: 'var(--text-muted)' }} />
          <div>
            <h3 className="title-serif" style={{ fontSize: '24px', marginBottom: '8px' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Add some delicious dishes from our shop menu!</p>
          </div>
          <Link to="/shop" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Cart Table list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.id} className="glass-panel" style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 50px',
                alignItems: 'center',
                padding: '20px',
                gap: '20px'
              }}>
                {/* Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                  <img
                    src={item.image.startsWith('http') ? item.image : `/uploads/${item.image}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400';
                    }}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Name */}
                <div>
                  <h4 className="title-serif" style={{ fontSize: '18px' }}>{item.name}</h4>
                </div>

                {/* Price */}
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary)' }}>
                  ₹{item.price}/-
                </div>

                {/* Qty Pick */}
                <div>
                  <div className="quantity-picker" style={{ width: 'fit-content' }}>
                    <button
                      type="button"
                      className="quantity-btn"
                      onClick={() => handleQtyChange(item, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      className="quantity-input"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="quantity-btn"
                      onClick={() => handleQtyChange(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  ₹{item.price * item.quantity}/-
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  style={{ color: 'var(--accent-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary Controls */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/shop" className="btn btn-secondary">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="btn btn-danger">
                Clear Cart
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
                Grand Total : <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '26px' }}>₹{cartTotal}/-</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary"
                style={{ padding: '14px 32px' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
