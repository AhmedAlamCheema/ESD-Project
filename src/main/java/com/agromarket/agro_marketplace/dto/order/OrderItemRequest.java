package com.agromarket.agro_marketplace.dto.order;

import jakarta.validation.constraints.*;

public record OrderItemRequest(
        @NotNull Long productId,
        @NotNull @Positive Integer quantity
) {}
