package com.example.ecommerce.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class AdminStatsResponse {
    private double totalRevenue;
    private long totalOrders;
    private long totalProducts;
    private long totalUsers;
    private List<OrderResponse> recentOrders;
    private Map<String, Long> ordersByStatus;
}
