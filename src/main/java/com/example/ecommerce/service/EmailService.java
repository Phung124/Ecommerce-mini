package com.example.ecommerce.service;

import com.example.ecommerce.model.Order;

public interface EmailService {
    void sendOrderReceipt(Order order, String toEmail);
}
