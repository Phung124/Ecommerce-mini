package com.example.ecommerce.service;

import com.example.ecommerce.payload.request.ChangePasswordRequest;
import com.example.ecommerce.payload.request.LoginRequest;
import com.example.ecommerce.payload.request.SignupRequest;
import com.example.ecommerce.payload.response.JwtResponse;
import com.example.ecommerce.payload.response.TokenRefreshResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    void registerUser(SignupRequest signUpRequest);

    void registerAdminUser(SignupRequest signUpRequest);

    TokenRefreshResponse refreshToken(String requestRefreshToken);

    void logoutUser(Long userId);

    void changePassword(ChangePasswordRequest request, Long userId);

    void promoteUserToAdmin(Long userId);
}
