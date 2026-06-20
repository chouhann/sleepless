import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading admin metrics...</div>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in">
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '48px' }}>Admin Dashboard</h2>

      {stats && (
        <div className="stats-grid">
          {/* Pendings */}
          <div className="stat-box glass-panel">
            <h3>₹{stats.totalPendings}/-</h3>
            <p>Total Pendings</p>
          </div>

          {/* Income */}
          <div className="stat-box glass-panel">
            <h3>₹{stats.totalIncome}/-</h3>
            <p>Total Income</p>
          </div>

          {/* Orders Count */}
          <div className="stat-box glass-panel">
            <h3>{stats.orderPlaced}</h3>
            <p>Orders Placed</p>
          </div>

          {/* Dishes Count */}
          <div className="stat-box glass-panel">
            <h3>{stats.dishesAdded}</h3>
            <p>Dishes Added</p>
          </div>

          {/* Users Count */}
          <div className="stat-box glass-panel">
            <h3>{stats.users}</h3>
            <p>Normal Users</p>
          </div>

          {/* Admins Count */}
          <div className="stat-box glass-panel">
            <h3>{stats.admins}</h3>
            <p>Admin Users</p>
          </div>

          {/* Total Accounts */}
          <div className="stat-box glass-panel">
            <h3>{stats.totalAccounts}</h3>
            <p>Total Accounts</p>
          </div>

          {/* Messages Count */}
          <div className="stat-box glass-panel">
            <h3>{stats.newMessages}</h3>
            <p>Inbound Messages</p>
          </div>
        </div>
      )}
    </div>
  );
};
