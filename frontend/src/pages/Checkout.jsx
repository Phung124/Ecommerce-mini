import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Truck, CreditCard, ChevronLeft, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shippingStreet: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingPhoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!cart || (cart.items.length === 0 && !orderComplete)) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Your bag is empty</h2>
        <Link to="/shop" className="primary-btn" style={{ textDecoration: 'none' }}>Go to Shop</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', formData);
      setOrderComplete(true);
      toast.success('Order placed successfully!');
      fetchCart(); // Clear local cart state
    } catch (err) {
      toast.error('Error placing order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ maxWidth: '600px', margin: '0 auto', padding: '60px' }}
        >
          <CheckCircle2 size={80} color="var(--success)" style={{ marginBottom: '30px' }} />
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
            Thank you for your purchase. Your order has been placed successfully and will be processed shortly. 
            A confirmation email has been sent to your inbox.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/profile" className="secondary-btn" style={{ textDecoration: 'none' }}>View My Orders</Link>
            <Link to="/shop" className="primary-btn" style={{ textDecoration: 'none' }}>Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <button 
        onClick={() => navigate('/cart')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--text-muted)', marginBottom: '30px' }}
      >
        <ChevronLeft size={20} /> Back to Cart
      </button>

      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="gradient-text" 
        style={{ marginBottom: '40px', fontSize: '2.5rem' }}
      >
        Complete Your Order
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '40px', alignItems: 'start' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Truck size={24} className="gradient-text" /> Shipping Details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} /> Street Address
              </label>
              <input 
                type="text" 
                required 
                placeholder="123 Luxury Avenue"
                value={formData.shippingStreet}
                onChange={e => setFormData({...formData, shippingStreet: e.target.value})}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Tech City"
                  value={formData.shippingCity}
                  onChange={e => setFormData({...formData, shippingCity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>State / Region</label>
                <input 
                  type="text" 
                  required 
                  placeholder="CA"
                  value={formData.shippingState}
                  onChange={e => setFormData({...formData, shippingState: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Zip / Postal Code</label>
                <input 
                  type="text" 
                  required 
                  placeholder="90210"
                  value={formData.shippingZipCode}
                  onChange={e => setFormData({...formData, shippingZipCode: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> Phone Number
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="+1 (555) 000-0000"
                  value={formData.shippingPhoneNumber}
                  onChange={e => setFormData({...formData, shippingPhoneNumber: e.target.value})}
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={18} className="gradient-text" /> Payment Method
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Cash on Delivery (COD) is currently the only available payment method. 
                Pay our delivery partner when you receive your items.
              </p>
            </div>

            <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '40px', padding: '18px' }} disabled={loading}>
              {loading ? (
                <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
              ) : 'Confirm and Place Order'}
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card" 
          style={{ position: 'sticky', top: '100px' }}
        >
          <h3 style={{ marginBottom: '25px' }}>Order Review</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {cart.items.map(item => (
              <div key={item.productId} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  {item.imageUrl && <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.productName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: '600' }}>${item.totalPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', marginBottom: '20px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '800' }}>
            <span>Total</span>
            <span className="gradient-text">${cart.totalAmount.toFixed(2)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

