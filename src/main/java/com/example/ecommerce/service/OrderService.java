package com.example.ecommerce.service;

import com.example.ecommerce.payload.response.OrderResponse;
import com.example.ecommerce.model.OrderStatus;
import com.example.ecommerce.payload.request.OrderRequest;
import com.example.ecommerce.payload.response.PageResponse;

public interface OrderService {
    PageResponse<OrderResponse> getMyOrders(boolean isAdmin, Long userId, int page, int size, String sortBy, String sortDir);
    void placeOrder(OrderRequest orderRequest, Long userId);
    boolean updateOrderStatus(Long id, OrderStatus status);
}
