package com.agromarket.agro_marketplace.repository;

import com.agromarket.agro_marketplace.entity.Order;
import com.agromarket.agro_marketplace.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer_Email(String email);

    // for review rule (buyer must have delivered order containing that product)
    boolean existsByBuyer_EmailAndStatusAndItems_Product_Id(String email, OrderStatus status, Long productId);
}
