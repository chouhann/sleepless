import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, ChevronDown } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, addAlert } = useAuth();
  const [updatingIds, setUpdatingIds] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
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

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    setUpdatingIds((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Payment status updated!', 'success');
        fetchOrders();
      } else {
        addAlert(data.message || 'Failed to update payment status.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Order deleted successfully!', 'success');
        fetchOrders();
      } else {
        addAlert(data.message || 'Failed to delete order.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    }
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Placed Orders</h2>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No orders have been placed yet.
        </div>
      ) : (
        <div className="admin-list-container">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel admin-list-item" style={{ flexWrap: 'wrap' }}>
              
              {/* Order Info Details */}
              <div className="admin-list-details" style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <span className={`status-tag ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Placed on: {order.placedOn}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={14} style={{ color: 'var(--primary)' }} /> User ID: <span style={{ color: 'var(--text-primary)' }}>{order.userId}</span></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Recipient Name: <strong style={{ color: 'var(--text-primary)' }}>{order.name}</strong></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: 'var(--primary)' }} /> Number: <span style={{ color: 'var(--text-primary)' }}>{order.number}</span></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} style={{ color: 'var(--primary)' }} /> Email: <span style={{ color: 'var(--text-primary)' }}>{order.email}</span></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} style={{ color: 'var(--primary)' }} /> Address: <span style={{ color: 'var(--text-primary)' }}>{order.address}</span></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={14} style={{ color: 'var(--primary)' }} /> Method: <span style={{ color: 'var(--text-primary)' }}>{order.method}</span></p>
                  
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    marginTop: '8px',
                    color: 'var(--text-primary)'
                  }}>
                    <strong>Total Products:</strong> {order.totalProducts}
                  </div>
                </div>
              </div>

              {/* Order Controls */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '20px',
                flex: '1 1 200px',
                minWidth: '200px'
              }}>
                {/* Total Price display */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Price</p>
                  <h4 style={{ fontSize: '26px', color: 'var(--primary)', fontWeight: 800 }}>₹{order.totalPrice}/-</h4>
                </div>

                {/* Dropdown status update form */}
                <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative', width: '150px' }}>
                    <select
                      className="form-control"
                      value=""
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingIds[order.id]}
                      style={{ paddingRight: '36px', height: '44px' }}
                    >
                      <option value="" disabled>{updatingIds[order.id] ? 'Updating...' : order.paymentStatus}</option>
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                    </select>
                    <ChevronDown size={16} style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-secondary)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="btn btn-danger"
                    style={{ height: '44px', padding: '0 16px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
