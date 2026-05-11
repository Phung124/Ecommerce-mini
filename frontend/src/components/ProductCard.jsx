import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleAdd = async (e) => {
    e.stopPropagation(); // Prevent navigating to details
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/login');
      return;
    }
    const success = await addToCart(product.id, 1);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div 
      className="glass-card" 
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ display: 'flex', flexDirection: 'column', gap: '15px', cursor: 'pointer' }}
    >
      <div style={{ 
        height: '240px', 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '15px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ) : (
          <ShoppingBag size={48} style={{ opacity: 0.1 }} />
        )}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>In Stock</span>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {product.categoryName || 'Collection'}
        </span>
        <h4 style={{ margin: '8px 0', fontSize: '1.2rem', fontWeight: 600 }}>{product.name}</h4>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">${product.price.toFixed(2)}</span>
          <button 
            className="icon-btn primary-btn" 
            style={{ width: '40px', height: '40px', borderRadius: '12px' }} 
            onClick={handleAdd}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

