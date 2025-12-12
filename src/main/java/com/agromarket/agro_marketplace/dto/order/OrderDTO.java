package com.agromarket.agro_marketplace.dto.order;

import com.agromarket.agro_marketplace.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDTO(
        Long id,
        OrderStatus status,
        BigDecimal totalAmount,
        Instant createdAt,
        List<OrderItemDTO> items
) {}
