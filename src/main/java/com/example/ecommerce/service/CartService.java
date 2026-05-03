package com.example.ecommerce.service;

import com.example.ecommerce.payload.request.CartItemRequest;
import com.example.ecommerce.payload.response.CartResponse;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItemToCart(Long userId, CartItemRequest cartItemRequest);
    CartResponse removeItemFromCart(Long userId, Long productId);
    void clearCart(Long userId);
}
