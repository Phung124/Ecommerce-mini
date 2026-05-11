package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.User;
import com.example.ecommerce.payload.request.UpdateUserProfileRequest;
import com.example.ecommerce.payload.response.UserInfoResponse;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Optional<UserInfoResponse> getCurrentUser(Long userId) {
        return userRepository.findById(userId).map(this::mapToUserInfoResponse);
    }

    @Override
    public Optional<UserInfoResponse> updateCurrentUser(Long userId, UpdateUserProfileRequest request) {
        return userRepository.findById(userId).map(user -> {
            if (request.getUsername() != null && !request.getUsername().isBlank()) {
                user.setUsername(request.getUsername());
            }
            if (request.getEmail() != null && !request.getEmail().isBlank()) {
                user.setEmail(request.getEmail());
            }
            userRepository.save(user);
            return mapToUserInfoResponse(user);
        });
    }

    private UserInfoResponse mapToUserInfoResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return UserInfoResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }
}
