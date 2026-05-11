import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-nav">
      <div className="container" style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, letterSpacing: '-1px' }} className="gradient-text">PremiumShop</h1>
        </Link>
        
        <nav style={{ display: 'flex', gap: '40px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link to="/" style={{ color: isActive('/') ? 'var(--primary-color)' : 'var(--text-main)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>Home</Link>
          <Link to="/shop" style={{ color: isActive('/shop') ? 'var(--primary-color)' : 'var(--text-main)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>Shop</Link>
          <Link to="/about" style={{ color: isActive('/about') ? 'var(--primary-color)' : 'var(--text-main)', textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>About</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="icon-btn" onClick={() => navigate('/shop')} title="Search">
            <Search size={20} />
          </button>

          <Link to="/cart" className="icon-btn" style={{ position: 'relative', textDecoration: 'none' }}>
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  background: 'var(--secondary-color)', 
                  color: 'white', 
                  fontSize: '0.65rem', 
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }}></div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {user.roles && user.roles.includes('ROLE_ADMIN') && (
                <Link to="/admin" className="glass-btn" style={{ textDecoration: 'none', color: '#60a5fa', fontSize: '0.9rem', fontWeight: '600', padding: '8px 16px', borderRadius: '15px', border: '1px solid rgba(96, 165, 250, 0.3)', background: 'rgba(59, 130, 246, 0.1)' }}>
                  Admin
                </Link>
              )}
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '15px', textDecoration: 'none', color: 'white', border: '1px solid var(--glass-border)', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="icon-btn" title="Logout" style={{ color: 'var(--text-muted)' }}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="primary-btn" style={{ textDecoration: 'none', borderRadius: '15px', padding: '10px 25px' }}>Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

