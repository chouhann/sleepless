import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, Tag, CreditCard } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="container section-padding animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Placed Orders</h2>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <ClipboardList size={60} style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>You haven't placed any orders yet!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <span className={`status-tag ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {order.placedOn}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <p><strong style={{ color: 'var(--text-secondary)' }}>Name:</strong> {order.name}</p>
                <p><strong style={{ color: 'var(--text-secondary)' }}>Number:</strong> {order.number}</p>
                <p><strong style={{ color: 'var(--text-secondary)' }}>Email:</strong> {order.email}</p>
                <p><strong style={{ color: 'var(--text-secondary)' }}>Address:</strong> {order.address}</p>
                <p><strong style={{ color: 'var(--text-secondary)' }}>Payment Method:</strong> {order.method}</p>
                
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  margin: '8px 0'
                }}>
                  <p><strong style={{ color: 'var(--text-secondary)' }}>Dishes:</strong> {order.totalProducts}</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '16px',
                marginTop: 'auto'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Total Price :</span>
                <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '20px' }}>₹{order.totalPrice}/-</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
