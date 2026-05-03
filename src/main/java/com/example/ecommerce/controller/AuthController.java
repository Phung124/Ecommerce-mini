package com.example.ecommerce.controller;

import com.example.ecommerce.payload.request.ChangePasswordRequest;
import com.example.ecommerce.payload.request.LoginRequest;
import com.example.ecommerce.payload.request.SignupRequest;
import com.example.ecommerce.payload.request.TokenRefreshRequest;
import com.example.ecommerce.payload.response.MessageResponse;
import com.example.ecommerce.security.services.UserDetailsImpl;
import com.example.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            authService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerAdminUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            authService.registerAdminUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully by Admin!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
            
        }
    }

    @PutMapping("/admin/users/{userId}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> promoteUserToAdmin(@PathVariable Long userId) {
        try {
            authService.promoteUserToAdmin(userId);
            return ResponseEntity.ok(new MessageResponse("User successfully promoted to Admin!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        try {
            return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if ("anonymousUser".equals(principle.toString())) {
            return ResponseEntity.ok(new MessageResponse("You've been logged out!"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) principle;
        authService.logoutUser(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Object principle = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if ("anonymousUser".equals(principle.toString())) {
                return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
            }
            UserDetailsImpl userDetails = (UserDetailsImpl) principle;
            
            authService.changePassword(request, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Password changed successfully! All existing sessions have been revoked. Please login again."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
