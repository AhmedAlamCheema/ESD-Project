package com.agromarket.agro_marketplace.dto.review;

import jakarta.validation.constraints.*;

public record CreateReviewRequest(
        @NotNull Long productId,
        @Min(1) @Max(5) int rating,
        String comment
) {}
