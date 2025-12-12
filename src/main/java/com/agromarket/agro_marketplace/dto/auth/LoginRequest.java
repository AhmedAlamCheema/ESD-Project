package com.agromarket.agro_marketplace.dto.auth;

import jakarta.validation.constraints.*;

public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password
) {}
