import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldAlert, Trash2 } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, addAlert } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account?')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'User deleted successfully!', 'success');
        fetchUsers();
      } else {
        addAlert(data.message || 'Failed to delete user.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    }
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>User Accounts</h2>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading users list...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {users.map((userItem) => (
            <div key={userItem.id} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="glass-panel" style={{ padding: '10px', color: userItem.userType === 'admin' ? 'var(--primary)' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <User size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)' }}>{userItem.name}</h4>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: userItem.userType === 'admin' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}>
                    {userItem.userType}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <p><strong>User ID:</strong> {userItem.id}</p>
                <p style={{ marginTop: '4px' }}><strong>Email:</strong> {userItem.email}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '8px' }}>
                <button
                  onClick={() => handleDeleteUser(userItem.id)}
                  className="btn btn-danger"
                  style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={14} /> Delete Account
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
