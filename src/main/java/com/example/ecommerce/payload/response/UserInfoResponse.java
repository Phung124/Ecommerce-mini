package com.example.ecommerce.payload.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UserInfoResponse {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
