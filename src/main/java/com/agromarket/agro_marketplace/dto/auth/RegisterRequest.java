package com.agromarket.agro_marketplace.dto.auth;

import com.agromarket.agro_marketplace.entity.Role;
import jakarta.validation.constraints.*;
import java.util.Set;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @Size(min = 6) String password,
        Set<Role> roles,
        String phone,
        String city
) {}
