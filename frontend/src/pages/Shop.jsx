import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search } from 'lucide-react';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const url = search.trim() ? `/api/products?search=${encodeURIComponent(search.trim())}` : '/api/products';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        // Reset/initialize quantities
        const qMap = {};
        data.forEach((p) => {
          qMap[p.id] = 1;
        });
        setQuantities(qMap);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

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
      {/* Banner */}
      <div style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: 'linear-gradient(rgba(19, 27, 46, 0.9), rgba(11, 15, 25, 0.95)), url("https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200") center/cover no-repeat',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <h2 className="title-serif" style={{ fontSize: '36px', marginBottom: '8px' }}>Our Menu</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Home / Shop</p>
      </div>

      {/* Search and Grid Container */}
      <div className="container section-padding">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} style={{
          maxWidth: '600px',
          margin: '0 auto 56px auto',
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px', height: '50px' }}
            />
            <Search size={18} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '50px', padding: '0 24px' }}>
            Search
          </button>
        </form>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '20px' }}>No dishes found matching your criteria.</p>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); fetchProducts(''); }} className="btn btn-secondary">
                Clear Search
              </button>
            )}
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
      </div>
    </div>
  );
};
