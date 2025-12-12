package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.order.*;
import com.agromarket.agro_marketplace.entity.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderDTO create(CreateOrderRequest req, String buyerEmail);
    List<OrderDTO> myOrders(String buyerEmail);
    OrderDTO getById(Long id, String requesterEmail, boolean isAdmin);
    OrderDTO updateStatus(Long id, OrderStatus status);
}
