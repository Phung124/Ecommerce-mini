import React, { useEffect, useState, useRef } from 'react';
import api, { adminService } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminProducts = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?size=100'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.content);
      setCategories(catRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: ''
      });
    }
    setShowModal(true);
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/files/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Cập nhật link ảnh vào form
      const newUrl = response.data.url;
      setFormData(prev => ({ ...prev, imageUrl: newUrl }));

      toast.success('Image uploaded successfully!');

      // Quan trọng: Reset input để có thể chọn lại cùng 1 file hoặc dùng cho sản phẩm tiếp theo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Đảm bảo dữ liệu gửi lên đúng định dạng số
    const submitData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      categoryId: formData.categoryId === '' ? null : formData.categoryId
    };

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, submitData);
        toast.success('Product updated');
      } else {
        await adminService.createProduct(submitData);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.defaultMessage || 'Operation failed';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(id);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-view">
      <div className="view-header">
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Search products..." />
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="img-container">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="prod-thumb" 
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                      />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                  </div>
                </td>
                <td className="font-medium">{product.name}</td>
                <td>{categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}</td>
                <td>${product.price}</td>
                <td>
                  <span className={`stock-count ${product.stock < 10 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleOpenModal(product)}><FiEdit2 /></button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-input-group">
                  <input
                    type="text"
                    required
                    placeholder="Image URL..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <label className="upload-btn-label">
                    {uploading ? '...' : <FiPlus />}
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="img-preview">
                    <img src={formData.imageUrl} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={uploading}
                  style={{ opacity: uploading ? 0.5 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                  {uploading ? 'Uploading...' : (editingProduct ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-view { display: flex; flex-direction: column; gap: 1.5rem; }
        .view-header { display: flex; justify-content: space-between; align-items: center; }
        
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 300px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          outline: none;
        }

        .add-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .table-card {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        table { width: 100%; border-collapse: collapse; }
        th { padding: 1.25rem 1.5rem; text-align: left; color: #94a3b8; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        td { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

        .img-container { width: 48px; height: 48px; border-radius: 8px; overflow: hidden; background: rgba(255,255,255,0.05); }
        .prod-thumb { width: 100%; height: 100%; object-fit: cover; }
        .no-image-placeholder { 
          width: 100%; height: 100%; display: flex; align-items: center; 
          justify-content: center; font-size: 0.6rem; color: #64748b; text-align: center;
        }
        .font-medium { font-weight: 500; }
        
        .stock-count {
          padding: 0.25rem 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 6px;
        }
        .stock-count.low { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .action-btns { display: flex; gap: 0.5rem; }
        .action-btns button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .edit-btn { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .delete-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #1e293b;
          width: 100%;
          max-width: 600px;
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header button { background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .form-group label { color: #94a3b8; font-size: 0.875rem; }
        .form-group input, .form-group select, .form-group textarea {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 0.75rem;
          color: white;
        }

        .image-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .image-input-group input {
          flex: 1;
        }

        .upload-btn-label {
          width: 46px;
          height: 46px;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 1px dashed #3b82f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-btn-label:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .img-preview {
          margin-top: 0.75rem;
          width: 100%;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .img-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .cancel-btn { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; }
        .submit-btn { background: #3b82f6; border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminProducts;
