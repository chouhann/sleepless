import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, User, MessageSquare, Trash2 } from 'lucide-react';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, addAlert } = useAuth();

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Message deleted successfully!', 'success');
        fetchMessages();
      } else {
        addAlert(data.message || 'Failed to delete message.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    }
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Inbound Messages</h2>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No messages received yet.
        </div>
      ) : (
        <div className="admin-list-container">
          {messages.map((message) => (
            <div key={message.id} className="glass-panel admin-list-item" style={{ flexWrap: 'wrap', gap: '32px' }}>
              
              {/* Message Details */}
              <div className="admin-list-details" style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}><User size={16} style={{ color: 'var(--primary)' }} /> Sender: <strong style={{ color: 'var(--text-primary)' }}>{message.name}</strong> (User ID: {message.userId})</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} style={{ color: 'var(--primary)' }} /> Number: <span style={{ color: 'var(--text-primary)' }}>{message.number}</span></p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} style={{ color: 'var(--primary)' }} /> Email: <span style={{ color: 'var(--text-primary)' }}>{message.email}</span></p>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  gap: '12px',
                  lineHeight: 1.6
                }}>
                  <MessageSquare size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <p>"{message.message}"</p>
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Trash2 size={16} /> Delete Message
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
