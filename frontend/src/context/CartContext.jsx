import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
      const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setItemCount(totalItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', { productId, quantity });
      setCart(res.data);
      const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setItemCount(totalItems);
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      setCart(res.data);
      const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setItemCount(totalItems);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, itemCount, fetchCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
