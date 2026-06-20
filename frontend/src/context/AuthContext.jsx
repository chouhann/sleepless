import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sleepless_token'));
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  // Toast alert trigger helper
  const addAlert = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 4000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Fetch current user details on load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('sleepless_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to authenticate token', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Incorrect email or password!');
      }

      localStorage.setItem('sleepless_token', data.accessToken);
      setToken(data.accessToken);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.userType
      });
      addAlert('Logged in successfully!', 'success');
      return { success: true, userType: data.userType };
    } catch (err) {
      addAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async (name, email, password, userType, registrationCode) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, userType, registrationCode })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      addAlert('Registered successfully! Log in to continue.', 'success');
      return { success: true };
    } catch (err) {
      addAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('sleepless_token');
    setToken(null);
    setUser(null);
    addAlert('Logged out successfully.', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, alerts, addAlert, removeAlert }}>
      {children}
      {/* Global Alerts Portal */}
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-toast glass-panel ${alert.type}`} style={{ cursor: 'pointer' }} onClick={() => removeAlert(alert.id)}>
            <span>{alert.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
