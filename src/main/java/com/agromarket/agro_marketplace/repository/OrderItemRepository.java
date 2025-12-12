package com.agromarket.agro_marketplace.repository;

import com.agromarket.agro_marketplace.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
