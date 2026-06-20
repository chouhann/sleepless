import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChefHat, ShoppingCart, ArrowRight } from 'lucide-react';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=6');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          // Initialize quantities
          const qMap = {};
          data.forEach((p) => {
            qMap[p.id] = 1;
          });
          setQuantities(qMap);
        }
      } catch (err) {
        console.error('Error fetching latest products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProducts();
  }, []);

  const handleQtyChange = (productId, val) => {
    if (val < 1) return;
    setQuantities((prev) => ({ ...prev, [productId]: val }));
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const qty = quantities[product.id] || 1;
    await addToCart(product, qty);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner Section */}
      <section style={{
        minHeight: '80vh',
        background: 'linear-gradient(rgba(11, 15, 25, 0.75), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600") no-repeat center/cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(245, 166, 35, 0.4)' }}>
            <ChefHat size={32} style={{ color: 'var(--primary)' }} />
            <span className="title-serif" style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '1px' }}>SLEEPLESS CAFE</span>
          </div>

          <h3 className="title-serif" style={{ fontSize: 'clamp(32px, 6vw, 54px)', fontWeight: 800, lineHeight: 1.2 }}>
            "Delectable food on your plate."
          </h3>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxW: '600px', lineHeight: 1.6 }}>
            Savor the symphony of flavors that dance upon the palate, a culinary masterpiece that whispers poetry to the taste buds, inviting you on a journey of epicurean delight.
          </p>

          <Link to="/about" className="btn btn-primary" style={{ marginTop: '12px' }}>
            Discover More <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Latest Dishes Section */}
      <section className="section-padding container">
        <h1 className="title-serif gradient-text" style={{ fontSize: '36px', textAlign: 'center', marginBottom: '16px' }}>
          Latest Dishes
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '56px', fontSize: '15px' }}>
          Hand-crafted gourmet meals prepared fresh by our elite chefs
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading latest dishes...</div>
        ) : products.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No dishes added yet! Check back soon or visit as Admin to upload.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card glass-panel">
                <div className="product-card-img-container">
                  <img
                    className="product-card-img"
                    src={product.image.startsWith('http') ? product.image : `/uploads/${product.image}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400';
                    }}
                    alt={product.name}
                  />
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-title">{product.name}</h3>
                  <div className="product-card-price">₹{product.price}/-</div>
                  
                  <form onSubmit={(e) => handleAddToCart(e, product)} className="product-card-footer">
                    <div className="quantity-picker">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQtyChange(product.id, (quantities[product.id] || 1) - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="quantity-input"
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value) || 1)}
                        required
                      />
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => handleQtyChange(product.id, (quantities[product.id] || 1) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '0 16px', height: '44px' }}>
                      <ShoppingCart size={16} /> Add
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '56px', textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-secondary">
            View All Dishes
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container section-padding" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800" alt="Gourmet Dining Room" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 className="title-serif gradient-text" style={{ fontSize: '36px' }}>About Us</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
              From mouthwatering appetizers to decadent desserts, our menu boasts a tantalizing array of dishes inspired by global cuisines. Whether you crave savory comfort food or an adventurous gastronomic experience, we have something for every palate.
            </p>
            <div>
              <Link to="/about" className="btn btn-primary">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner Section */}
      <section style={{
        background: 'linear-gradient(rgba(11, 15, 25, 0.8), rgba(11, 15, 25, 0.8)), url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1600") center/cover no-repeat',
        textAlign: 'center',
        padding: '100px 24px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <h3 className="title-serif" style={{ fontSize: '32px' }}>"Give us your insightful thoughts."</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            We highly value your insights and would appreciate it if you could share your thoughts on our services. Your feedback is important to us.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: '12px' }}>
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};
