package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.payment.*;
import com.agromarket.agro_marketplace.entity.*;
import com.agromarket.agro_marketplace.repository.*;
import com.agromarket.agro_marketplace.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    public PaymentServiceImpl(PaymentRepository paymentRepo, OrderRepository orderRepo, UserRepository userRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
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

        // Add revenue to each seller based on their items in this order
        Map<Long, BigDecimal> sellerRevenue = new HashMap<>();
        for (OrderItem item : order.getItems()) {
            Long sellerId = item.getProduct().getSeller().getId();
            BigDecimal lineTotal = item.getLineTotal();
            sellerRevenue.merge(sellerId, lineTotal, BigDecimal::add);
        }

        for (Map.Entry<Long, BigDecimal> entry : sellerRevenue.entrySet()) {
            User seller = userRepo.findById(entry.getKey()).orElse(null);
            if (seller != null) {
                BigDecimal currentRevenue = seller.getRevenue() != null ? seller.getRevenue() : BigDecimal.ZERO;
                seller.setRevenue(currentRevenue.add(entry.getValue()));
                userRepo.save(seller);
            }
        }

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
