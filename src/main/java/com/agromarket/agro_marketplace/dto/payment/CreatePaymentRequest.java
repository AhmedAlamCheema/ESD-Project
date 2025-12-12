package com.agromarket.agro_marketplace.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePaymentRequest(
        @NotNull Long orderId,
        @NotBlank String method,
        String reference
) {}
