import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from /api/products...');
      const res = await api.get('/products');
      console.log('API Response:', res.data);
      setProducts(res.data.content || res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Could not connect to Backend. Please check if Spring Boot is running on port 8081.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      {/* Shop Header */}
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-text" 
          style={{ fontSize: '3.5rem', marginBottom: '15px' }}
        >
          Curated Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}
        >
          Discover premium products designed for the modern lifestyle.
        </motion.p>
      </div>

      {/* Filters & Search */}
      <div className="glass-card" style={{ marginBottom: '40px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            style={{ paddingLeft: '45px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '200px' }}>
          <Filter size={20} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '12px', borderRadius: '12px', width: '100%' }}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} /> Sort
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <div className="animate-spin" style={{ width: '50px', height: '50px', border: '5px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}></div>
        </div>
      ) : (
        <motion.div 
          layout
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px' 
          }}
        >
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px' }}
              >
                <Search size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <h3>No products found matching your criteria</h3>
                <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="primary-btn" style={{ marginTop: '20px' }}>Clear Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Shop;

