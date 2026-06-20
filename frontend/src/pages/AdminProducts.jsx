import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, addAlert } = useAuth();

  // Create form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [adding, setAdding] = useState(false);

  // Edit states
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !imageFile) {
      addAlert('All fields including image are required!', 'error');
      return;
    }

    setAdding(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Dish added successfully!', 'success');
        setName('');
        setPrice('');
        setImageFile(null);
        // Reset file input value
        document.getElementById('productImage').value = '';
        fetchProducts();
      } else {
        addAlert(data.message || 'Could not add dish.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditImageFile(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editName || !editPrice) {
      addAlert('Name and price are required!', 'error');
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append('name', editName);
    formData.append('price', editPrice);
    if (editImageFile) {
      formData.append('image', editImageFile);
    }

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Dish updated successfully!', 'success');
        setEditingProduct(null);
        fetchProducts();
      } else {
        addAlert(data.message || 'Could not update dish.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Delete this dish?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        addAlert(data.message || 'Dish deleted successfully!', 'success');
        fetchProducts();
      } else {
        addAlert(data.message || 'Failed to delete dish.', 'error');
      }
    } catch (err) {
      addAlert('Network error occurred.', 'error');
    }
  };

  return (
    <div className="container section-padding animate-fade-in">
      <h2 className="title-serif gradient-text" style={{ fontSize: '36px', marginBottom: '40px' }}>Manage Dishes</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        
        {/* Add Product Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="title-serif" style={{ fontSize: '22px', marginBottom: '24px' }}>Add Dish</h3>
          
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Dish Name</label>
              <input
                type="text"
                id="productName"
                className="form-control"
                placeholder="enter dish name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productPrice">Price (₹)</label>
              <input
                type="number"
                min="0"
                id="productPrice"
                className="form-control"
                placeholder="enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label htmlFor="productImage">Dish Image</label>
              <input
                type="file"
                id="productImage"
                accept="image/jpg, image/jpeg, image/png"
                className="form-control"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={adding}>
              {adding ? 'Adding...' : <><Plus size={16} /> Add Dish</>}
            </button>
          </form>
        </div>

        {/* Catalog List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 className="title-serif" style={{ fontSize: '22px' }}>Dishes Directory</h3>
          
          {loading ? (
            <div style={{ color: 'var(--text-secondary)' }}>Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No dishes added yet! Use the form to upload the first one.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {products.map((product) => (
                <div key={product.id} className="product-card glass-panel">
                  <div className="product-card-img-container" style={{ paddingBottom: '70%' }}>
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
                  <div className="product-card-body" style={{ padding: '16px' }}>
                    <h4 className="product-card-title" style={{ fontSize: '16px' }}>{product.name}</h4>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)', margin: '8px 0' }}>₹{product.price}/-</div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="btn btn-secondary"
                        style={{ flexGrow: 1, padding: '6px 12px', fontSize: '12px' }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Edit Form Modal Drawer overlay */}
      {editingProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '40px', position: 'relative' }}>
            <button
              onClick={() => setEditingProduct(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 className="title-serif" style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>Edit Dish</h3>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label htmlFor="editName">Dish Name</label>
                <input
                  type="text"
                  id="editName"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editPrice">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  id="editPrice"
                  className="form-control"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label htmlFor="editImage">New Image (Optional)</label>
                <input
                  type="file"
                  id="editImage"
                  accept="image/jpg, image/jpeg, image/png"
                  className="form-control"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flexGrow: 2 }}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
