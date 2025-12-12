package com.agromarket.agro_marketplace.dto.payment;

import com.agromarket.agro_marketplace.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentDTO(
        Long id,
        Long orderId,
        BigDecimal amount,
        PaymentStatus status,
        String method,
        String reference,
        Instant paidAt
) {}
