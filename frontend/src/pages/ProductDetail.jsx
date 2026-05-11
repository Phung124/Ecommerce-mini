import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product with ID: ${id}`);
        const res = await api.get(`/products/${id}`);
        console.log('Product Data:', res.data);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const success = await addToCart(product.id, quantity);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/shop')} className="primary-btn" style={{ marginTop: '20px' }}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--text-muted)', marginBottom: '30px' }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px' }}>
        {/* Product Image */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ opacity: 0.1 }}><ShoppingCart size={120} /></div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '10px', display: 'inline-block' }}>
              {product.categoryName || 'New Arrival'}
            </span>
            <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', color: '#fbbf24' }}>
                <Star size={18} fill="#fbbf24" />
                <Star size={18} fill="#fbbf24" />
                <Star size={18} fill="#fbbf24" />
                <Star size={18} fill="#fbbf24" />
                <Star size={18} fill="none" />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>(124 reviews)</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            {product.description || 'Elevate your lifestyle with this premium product. Crafted with precision and designed for those who appreciate the finer things in life. Experience unmatched quality and style.'}
          </p>

          <div style={{ fontSize: '2.5rem', fontWeight: '800' }} className="gradient-text">
            ${product.price.toFixed(2)}
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '5px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ width: '40px', height: '40px', background: 'transparent' }}
              >-</button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '40px', height: '40px', background: 'transparent' }}
              >+</button>
            </div>
            <button className="primary-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div className="glass-card" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '15px' }}>
              <Truck size={24} className="gradient-text" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Free Shipping</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders over $100</div>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '15px' }}>
              <ShieldCheck size={24} className="gradient-text" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>2 Year Warranty</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full peace of mind</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
