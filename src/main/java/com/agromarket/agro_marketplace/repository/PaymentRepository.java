package com.agromarket.agro_marketplace.repository;

import com.agromarket.agro_marketplace.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder_Id(Long orderId);
}
