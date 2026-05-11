import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Headphones, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        gap: '30px', 
        padding: '80px 0',
        position: 'relative'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', top: '0', zIndex: -1, opacity: 0.2 }}
        >
          <Zap size={300} color="var(--primary-color)" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '4.5rem', lineHeight: 1.1, fontWeight: '800', letterSpacing: '-2px' }}
        >
          Elevate Your <br />
          <span className="gradient-text">Lifestyle Experience</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'var(--text-muted)', maxWidth: '700px', fontSize: '1.25rem', lineHeight: '1.6' }}
        >
          Discover a meticulously curated collection of high-end products designed for the modern connoisseur. 
          Seamless interfaces meet premium craftsmanship.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: '20px', marginTop: '20px' }}
        >
          <Link to="/shop" className="primary-btn" style={{ textDecoration: 'none', padding: '18px 45px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Explore Collection <ArrowRight size={20} />
          </Link>
          <Link to="/about" className="secondary-btn" style={{ textDecoration: 'none', padding: '18px 45px', fontSize: '1.1rem', borderRadius: '15px' }}>
            Our Story
          </Link>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section style={{ 
        marginTop: '80px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '30px' 
      }}>
        {[
          { icon: <Truck size={32} />, title: 'Global Delivery', desc: 'Premium logistics for our exclusive members worldwide.' },
          { icon: <ShieldCheck size={32} />, title: 'Secure Checkout', desc: 'End-to-end encrypted transactions for your peace of mind.' },
          { icon: <Headphones size={32} />, title: 'Concierge Support', desc: 'Our dedicated luxury assistants are available 24/7.' }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10 }}
            className="glass-card" 
            style={{ textAlign: 'center', padding: '40px 30px' }}
          >
            <div className="gradient-text" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Section */}
      <section style={{ marginTop: '120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', marginBottom: '10px', display: 'inline-block' }}>New Arrivals</span>
            <h2 style={{ fontSize: '3rem' }}>The <span className="gradient-text">Premium</span> Selection</h2>
          </div>
          <Link to="/shop" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '0', height: '450px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', zIndex: 1 }}></div>
            <div style={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShoppingBag size={100} style={{ opacity: 0.1 }} />
            </div>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Tech Collection</h3>
              <p style={{ color: 'var(--text-muted)' }}>Latest innovative gadgets</p>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '0', height: '450px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', zIndex: 1 }}></div>
            <div style={{ height: '100%', width: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Star size={100} style={{ opacity: 0.1 }} />
            </div>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Luxury Lifestyle</h3>
              <p style={{ color: 'var(--text-muted)' }}>Curated for your comfort</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

