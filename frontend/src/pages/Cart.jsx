import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, fetchCart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, delta) => {
    const success = await addToCart(productId, delta);
    if (!success) toast.error('Failed to update quantity');
  };

  const handleRemove = async (productId) => {
    const success = await removeFromCart(productId);
    if (success) toast.success('Item removed from cart');
    else toast.error('Failed to remove item');
  };

  if (!cart) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px' }}
      >
        <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Your Bag</h1>
        <p style={{ color: 'var(--text-muted)' }}>You have {cart.items.length} items in your shopping bag.</p>
      </motion.div>

      {cart.items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ textAlign: 'center', padding: '100px 20px' }}
        >
          <ShoppingBag size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
          <h3>Your bag is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Looks like you haven't added anything to your bag yet.</p>
          <Link to="/shop" className="primary-btn" style={{ textDecoration: 'none' }}>
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatePresence>
              {cart.items.map(item => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card" 
                  style={{ display: 'flex', gap: '25px', alignItems: 'center', padding: '20px' }}
                >
                  <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingBag size={32} style={{ opacity: 0.1 }} />
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.productName}</h4>
                    <p className="gradient-text" style={{ fontWeight: '700' }}>${item.price.toFixed(2)}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '5px' }}>
                    <button 
                      className="icon-btn" 
                      style={{ width: '32px', height: '32px', background: 'transparent' }} 
                      onClick={() => handleUpdateQuantity(item.productId, -1)} 
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: '30px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                    <button 
                      className="icon-btn" 
                      style={{ width: '32px', height: '32px', background: 'transparent' }} 
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ width: '100px', textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>${item.totalPrice.toFixed(2)}</div>
                  </div>

                  <button className="icon-btn" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} onClick={() => handleRemove(item.productId)}>
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card" 
            style={{ position: 'sticky', top: '100px' }}
          >
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={20} className="gradient-text" /> Order Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-main)' }}>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Shipping</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Tax</span>
                <span style={{ color: 'var(--text-main)' }}>$0.00</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', marginBottom: '25px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '35px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Total</span>
              <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800' }}>
                ${cart.totalAmount.toFixed(2)}
              </span>
            </div>

            <button 
              className="primary-btn" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '15px' }}
              onClick={() => navigate('/checkout')}
            >
              Checkout Now <ArrowRight size={20} />
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '20px' }}>
              Secure checkout powered by PremiumPay
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cart;

