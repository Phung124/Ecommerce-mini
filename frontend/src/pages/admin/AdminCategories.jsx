import React, { useEffect, useState } from 'react';
import api, { adminService } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setName(cat.name);
    } else {
      setEditingCat(null);
      setName('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await adminService.updateCategory(editingCat.id, { name });
        toast.success('Category updated');
      } else {
        await adminService.createCategory({ name });
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category? Products will be moved to Uncategorized.')) {
      try {
        await adminService.deleteCategory(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-view">
      <div className="view-header">
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="cat-info">
              <h3>{cat.name}</h3>
              <p>ID: #{cat.id}</p>
            </div>
            <div className="cat-actions">
              <button onClick={() => handleOpenModal(cat)}><FiEdit2 /></button>
              <button onClick={() => handleDelete(cat.id)} className="delete"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCat ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="submit-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-view { display: flex; flex-direction: column; gap: 1.5rem; }
        .view-header { display: flex; justify-content: flex-end; }
        
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

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .category-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cat-info h3 { font-size: 1.125rem; margin-bottom: 0.25rem; }
        .cat-info p { color: #94a3b8; font-size: 0.75rem; }

        .cat-actions { display: flex; gap: 0.5rem; }
        .cat-actions button {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .cat-actions button:hover { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
        .cat-actions button.delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .modal-content { background: #1e293b; width: 400px; border-radius: 24px; padding: 2rem; border: 1px solid rgba(255, 255, 255, 0.1); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .modal-header button { background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group input { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 0.75rem; color: white; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .cancel-btn { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; }
        .submit-btn { background: #3b82f6; border: none; color: white; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AdminCategories;
