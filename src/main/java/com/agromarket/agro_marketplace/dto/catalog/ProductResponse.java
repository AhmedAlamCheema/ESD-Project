package com.agromarket.agro_marketplace.dto.catalog;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stockQty,
        Long categoryId,
        String categoryName,
        Long sellerId,
        String sellerName
) {}
