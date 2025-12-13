package com.agromarket.agro_marketplace.dto.user;

import java.math.BigDecimal;
import java.util.Set;

public record UserDTO(
        Long id,
        String fullName,
        String email,
        String phone,
        String city,
        Set<String> roles,
        BigDecimal revenue
) {
}
