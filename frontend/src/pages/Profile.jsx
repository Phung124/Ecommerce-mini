import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Shield, Package, Calendar, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
      setFormData({ username: res.data.username, email: res.data.email });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.content || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/me', formData);
      setProfile(res.data);
      toast.success('Profile updated successfully!');
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, username: res.data.username }));
    } catch (err) {
      toast.error('Error updating profile');
    }
  };

  if (loading) {
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
        <h1 className="gradient-text" style={{ fontSize: '3rem' }}>My Account</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your profile and track your premium orders.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Sidebar Tabs */}
        <div className="glass-card" style={{ padding: '15px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '15px', 
              borderRadius: '12px',
              background: activeTab === 'profile' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-muted)',
              textAlign: 'left'
            }}
          >
            <User size={20} /> Profile Information
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '15px', 
              borderRadius: '12px',
              marginTop: '5px',
              background: activeTab === 'orders' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--primary-color)' : 'var(--text-muted)',
              textAlign: 'left'
            }}
          >
            <Package size={20} /> Order History
          </button>
          <button 
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '15px', 
              borderRadius: '12px',
              marginTop: '5px',
              background: 'transparent',
              color: 'var(--danger)',
              textAlign: 'left'
            }}
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /> Sign Out
          </button>
        </div>

        {/* Tab Content */}
        <div className="glass-card">
          {activeTab === 'profile' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User className="gradient-text" /> Personal Details
              </h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} /> Username
                  </label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} /> Account Status / Roles
                  </label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {profile.roles.map(role => (
                      <span key={role} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '6px 15px' }}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="primary-btn" style={{ marginTop: '20px', padding: '12px 40px' }}>
                  Save Changes
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package className="gradient-text" /> My Orders
              </h3>
              
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Package size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
                  <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map(order => (
                    <div key={order.id} className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Order ID</div>
                          <div style={{ fontWeight: '700' }}>#ORD-{order.id}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Date</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
                          <span className={`badge badge-${order.status === 'DONE' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                            {order.status}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Amount</div>
                          <div className="gradient-text" style={{ fontWeight: '800', fontSize: '1.2rem' }}>${order.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{item.quantity}x</span> {item.productName}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

