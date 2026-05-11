import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ marginTop: '100px', borderTop: '1px solid var(--glass-border)', padding: '60px 0 30px' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>PremiumShop</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Redefining the digital shopping experience with premium curated collections and seamless glassmorphism interface.
            </p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <a href="#" className="icon-btn" style={{ width: '36px', height: '36px' }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="icon-btn" style={{ width: '36px', height: '36px' }}><i className="fab fa-twitter"></i></a>
              <a href="#" className="icon-btn" style={{ width: '36px', height: '36px' }}><i className="fab fa-instagram"></i></a>
              <a href="#" className="icon-btn" style={{ width: '36px', height: '36px' }}><i className="fab fa-github"></i></a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/shop" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shop</Link></li>
              <li><Link to="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cart</Link></li>
              <li><Link to="/profile" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '20px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Shipping Policy</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Return & Refund</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '20px' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <MapPin size={18} className="gradient-text" /> 123 Luxury St, Tech City
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Phone size={18} className="gradient-text" /> +1 (555) 123-4567
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Mail size={18} className="gradient-text" /> hello@premiumshop.com
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '30px', 
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          &copy; {new Date().getFullYear()} PremiumShop. All rights reserved. Made with ✨ by Antigravity.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
