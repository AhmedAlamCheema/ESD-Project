package com.agromarket.agro_marketplace.dto.review;

import java.time.Instant;

public record ReviewDTO(
        Long id,
        Long productId,
        String reviewerEmail,
        int rating,
        String comment,
        Instant createdAt
) {}
