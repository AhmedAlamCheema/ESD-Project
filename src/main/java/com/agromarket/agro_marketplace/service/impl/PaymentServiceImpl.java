package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.payment.*;
import com.agromarket.agro_marketplace.entity.*;
import com.agromarket.agro_marketplace.repository.*;
import com.agromarket.agro_marketplace.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;

    public PaymentServiceImpl(PaymentRepository paymentRepo, OrderRepository orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }

    @Transactional
    @Override
    public PaymentDTO pay(CreatePaymentRequest req, String buyerEmail, boolean isAdmin) {
        Order order = orderRepo.findById(req.orderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!isAdmin && !order.getBuyer().getEmail().equals(buyerEmail)) {
            throw new RuntimeException("Not allowed to pay for this order");
        }

        paymentRepo.findByOrder_Id(order.getId())
                .ifPresent(p -> { throw new RuntimeException("Payment already exists for this order"); });

        // Demo payment: mark as success immediately
        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.SUCCESS)
                .method(req.method())
                .reference(req.reference())
                .paidAt(Instant.now())
                .build();

        Payment saved = paymentRepo.save(payment);

        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        return toDTO(saved);
    }

    @Override
    public PaymentDTO getByOrderId(Long orderId, String requesterEmail, boolean isAdmin) {
        Payment payment = paymentRepo.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));

        if (!isAdmin && !payment.getOrder().getBuyer().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Not allowed to view this payment");
        }

        return toDTO(payment);
    }

    private PaymentDTO toDTO(Payment p) {
        return new PaymentDTO(
                p.getId(),
                p.getOrder().getId(),
                p.getAmount(),
                p.getStatus(),
                p.getMethod(),
                p.getReference(),
                p.getPaidAt()
        );
    }
}
