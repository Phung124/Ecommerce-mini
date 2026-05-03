package com.example.ecommerce.service.impl;

import com.example.ecommerce.model.RefreshToken;
import com.example.ecommerce.model.Role;
import com.example.ecommerce.model.RoleName;
import com.example.ecommerce.model.User;
import com.example.ecommerce.payload.request.ChangePasswordRequest;
import com.example.ecommerce.payload.request.LoginRequest;
import com.example.ecommerce.payload.request.SignupRequest;
import com.example.ecommerce.payload.response.JwtResponse;
import com.example.ecommerce.payload.response.TokenRefreshResponse;
import com.example.ecommerce.repository.RoleRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.security.jwt.JwtUtils;
import com.example.ecommerce.security.services.RefreshTokenService;
import com.example.ecommerce.security.services.UserDetailsImpl;
import com.example.ecommerce.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    private final RefreshTokenService refreshTokenService;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                refreshToken.getToken(),
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);
    }

    @Override
    public void registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    public void registerAdminUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                case "ROLE_ADMIN":
                case "admin":
                    Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                    break;
                default:
                    Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    public TokenRefreshResponse refreshToken(String requestRefreshToken) {
        RefreshToken tokenEntity = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));

        if (tokenEntity.isUsed()) {
            throw new RuntimeException("Refresh token was already used! Suspected replay attack.");
        }

        refreshTokenService.verifyExpiration(tokenEntity);
        User user = tokenEntity.getUser();

        // Mark current token as used
        tokenEntity.setUsed(true);
        refreshTokenService.save(tokenEntity);

        // Keep maximum history of roughly 5 tokens
        refreshTokenService.cleanUpOldTokens(user);

        // Generate new Access and Refresh Tokens
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
        String newAccessToken = jwtUtils.generateTokenFromUser(user);

        return new TokenRefreshResponse(newAccessToken, newRefreshToken.getToken());
    }

    @Override
    public void logoutUser(Long userId) {
        refreshTokenService.deleteByUserId(userId);
    }

    @Override
    public void changePassword(ChangePasswordRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Incorrect old password!");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setSecurityStamp(java.util.UUID.randomUUID().toString());
        userRepository.save(user);

        // Revoke all refresh tokens for this user
        refreshTokenService.deleteByUserId(user.getId());
    }

    @Override
    public void promoteUserToAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        user.getRoles().add(adminRole);
        user.setSecurityStamp(java.util.UUID.randomUUID().toString());
        userRepository.save(user);

        // Revoke all refresh tokens for this user so they must log in to get the new admin role in token
        refreshTokenService.deleteByUserId(user.getId());
    }
}
