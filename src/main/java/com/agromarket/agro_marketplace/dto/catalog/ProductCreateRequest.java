package com.agromarket.agro_marketplace.dto.catalog;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductCreateRequest(
        @NotBlank String name,
        String description,
        @NotNull @Positive BigDecimal price,
        @NotNull @PositiveOrZero Integer stockQty,
        @NotNull Long categoryId
) {}
