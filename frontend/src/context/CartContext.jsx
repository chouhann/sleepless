import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, user, addAlert } = useAuth();

  const fetchCart = async () => {
    if (!token || !user) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  const addToCart = async (product, quantity) => {
    if (!token) {
      addAlert('Please log in to add items to your cart.', 'error');
      return false;
    }
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        })
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Product added to cart!', 'success');
        fetchCart();
        return true;
      } else {
        addAlert(data.message || 'Could not add to cart', 'error');
        return false;
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
      return false;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`/api/cart/${id}?quantity=${quantity}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setCart((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        addAlert('Cart quantity updated!', 'success');
      } else {
        const data = await res.json();
        addAlert(data.message || 'Failed to update quantity', 'error');
      }
    } catch (err) {
      addAlert('Network error updating cart.', 'error');
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setCart((prev) => prev.filter((item) => item.id !== id));
        addAlert('Item removed from cart!', 'success');
      } else {
        const data = await res.json();
        addAlert(data.message || 'Failed to remove item', 'error');
      }
    } catch (err) {
      addAlert('Network error removing item.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setCart([]);
        addAlert('Cart cleared!', 'success');
      }
    } catch (err) {
      addAlert('Network error clearing cart.', 'error');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
