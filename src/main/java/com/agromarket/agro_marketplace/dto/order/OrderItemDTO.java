package com.agromarket.agro_marketplace.dto.order;

import java.math.BigDecimal;

public record OrderItemDTO(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal,
        Long sellerId,
        String sellerName,
        String sellerEmail
) {}
