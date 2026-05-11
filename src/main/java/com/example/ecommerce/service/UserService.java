package com.example.ecommerce.service;

import com.example.ecommerce.model.User;

import com.example.ecommerce.payload.request.UpdateUserProfileRequest;
import com.example.ecommerce.payload.response.UserInfoResponse;

import java.util.Optional;

public interface UserService {
    Optional<UserInfoResponse> getCurrentUser(Long userId);
    Optional<UserInfoResponse> updateCurrentUser(Long userId, UpdateUserProfileRequest request);
}
