package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.payload.request.CartItemRequest;
import com.example.ecommerce.payload.response.CartItemResponse;
import com.example.ecommerce.payload.response.CartResponse;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse addItemToCart(Long userId, CartItemRequest cartItemRequest) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(cartItemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Kiểm tra tồn kho (Lần 1 - theo yêu cầu người dùng)
        if (product.getStock() < cartItemRequest.getQuantity()) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(cartItemRequest.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + cartItemRequest.getQuantity();
            
            // Kiểm tra tổng số lượng sau khi thêm có vượt quá tồn kho không
            if (product.getStock() < newQuantity) {
                 throw new RuntimeException("Total quantity exceeds available stock!");
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(cartItemRequest.getQuantity());
            cart.getItems().add(newItem);
        }

        return convertToResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeItemFromCart(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return convertToResponse(cartRepository.save(cart));
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    private CartResponse convertToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        List<CartItemResponse> itemResponses = cart.getItems().stream().map(item -> {
            CartItemResponse res = new CartItemResponse();
            res.setProductId(item.getProduct().getId());
            res.setProductName(item.getProduct().getName());
            res.setQuantity(item.getQuantity());
            res.setPrice(item.getProduct().getPrice());
            res.setTotalPrice(item.getProduct().getPrice() * item.getQuantity());
            res.setImageUrl(item.getProduct().getImageUrl());
            return res;
        }).collect(Collectors.toList());

        response.setItems(itemResponses);
        response.setTotalAmount(itemResponses.stream()
                .mapToDouble(CartItemResponse::getTotalPrice)
                .sum());
        return response;
    }
}
