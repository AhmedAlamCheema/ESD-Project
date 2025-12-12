package com.agromarket.agro_marketplace.dto.order;

import com.agromarket.agro_marketplace.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull OrderStatus status
) {}
