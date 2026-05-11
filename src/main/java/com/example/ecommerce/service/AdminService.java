package com.example.ecommerce.service;

import com.example.ecommerce.payload.response.AdminStatsResponse;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.payload.response.UserInfoResponse;

public interface AdminService {
    AdminStatsResponse getDashboardStats();
    PageResponse<UserInfoResponse> getAllUsers(int page, int size);
    UserInfoResponse toggleUserRole(Long userId);
    void deleteUser(Long userId);
}
