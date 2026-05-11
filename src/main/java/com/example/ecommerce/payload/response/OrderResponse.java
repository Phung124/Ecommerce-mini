package com.example.ecommerce.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class OrderResponse {
    private Long id;
    private Double totalPrice;
    private String status;
    private Instant createdAt;
    private List<OrderItemResponse> items;

    // Shipping Information
    private String shippingStreet;
    private String shippingCity;
    private String shippingState;
    private String shippingZipCode;
    private String shippingPhoneNumber;

    private Long userId;
    private String username;
}
