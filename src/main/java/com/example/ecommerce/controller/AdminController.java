package com.example.ecommerce.controller;

import com.example.ecommerce.payload.response.AdminStatsResponse;
import com.example.ecommerce.payload.response.MessageResponse;
import com.example.ecommerce.payload.response.PageResponse;
import com.example.ecommerce.payload.response.UserInfoResponse;
import com.example.ecommerce.security.services.UserDetailsImpl;
import com.example.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponse<UserInfoResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> toggleUserRole(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        if (userDetails.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You cannot revoke your own admin rights!"));
        }
        return ResponseEntity.ok(adminService.toggleUserRole(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        if (userDetails.getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You cannot delete your own account while in admin mode!"));
        }
        adminService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
    }
}
