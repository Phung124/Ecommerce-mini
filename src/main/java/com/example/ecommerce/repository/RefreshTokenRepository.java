package com.example.ecommerce.repository;

import com.example.ecommerce.model.RefreshToken;
import com.example.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;
import java.util.List;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByUser(User user);

    List<RefreshToken> findByUserOrderByExpiryDateAsc(User user);
}
