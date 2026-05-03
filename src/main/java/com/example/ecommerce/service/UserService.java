package com.example.ecommerce.service;

import com.example.ecommerce.model.User;

import java.util.Optional;

public interface UserService {
    Optional<User> getCurrentUser(Long userId);
}
