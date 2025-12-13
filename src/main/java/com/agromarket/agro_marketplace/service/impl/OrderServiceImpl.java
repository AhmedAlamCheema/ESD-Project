package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.order.*;
import com.agromarket.agro_marketplace.dto.payment.PaymentDTO;
import com.agromarket.agro_marketplace.entity.*;
import com.agromarket.agro_marketplace.repository.*;
import com.agromarket.agro_marketplace.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final PaymentRepository paymentRepo;

    public OrderServiceImpl(OrderRepository orderRepo, ProductRepository productRepo, UserRepository userRepo, PaymentRepository paymentRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.paymentRepo = paymentRepo;
    }

    @Transactional
    @Override
    public OrderDTO create(CreateOrderRequest req, String buyerEmail) {
        User buyer = userRepo.findByEmail(buyerEmail)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Order order = Order.builder()
                .buyer(buyer)
                .status(OrderStatus.CREATED)
                .createdAt(Instant.now())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : req.items()) {
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.productId()));

            if (product.getStockQty() < itemReq.quantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // reduce stock
            product.setStockQty(product.getStockQty() - itemReq.quantity());
            productRepo.save(product);

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity()));

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build();

            order.getItems().add(oi);
            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);

        Order saved = orderRepo.save(order);
        return toDTO(saved);
    }

    @Override
    public List<OrderDTO> myOrders(String buyerEmail) {
        return orderRepo.findByBuyer_Email(buyerEmail).stream().map(this::toDTO).toList();
    }

    @Override
    public List<OrderDTO> sellerOrders(String sellerEmail) {
        return orderRepo.findOrdersBySeller(sellerEmail).stream().map(this::toDTO).toList();
    }

    @Override
    public List<OrderDTO> allOrders() {
        return orderRepo.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public OrderDTO getById(Long id, String requesterEmail, boolean isAdmin) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!isAdmin && !order.getBuyer().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Not allowed to view this order");
        }
        return toDTO(order);
    }

    @Transactional
    @Override
    public OrderDTO updateStatus(Long id, OrderStatus status, String userEmail, boolean isAdmin) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Farmers can only update status for orders containing their products
        if (!isAdmin) {
            boolean isSeller = order.getItems().stream()
                    .anyMatch(i -> i.getProduct().getSeller().getEmail().equals(userEmail));
            if (!isSeller) {
                throw new RuntimeException("You can only update orders for your products");
            }
        }
        
        order.setStatus(status);
        return toDTO(orderRepo.save(order));
    }

    private OrderDTO toDTO(Order o) {
        List<OrderItemDTO> items = o.getItems().stream()
                .map(i -> new OrderItemDTO(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getLineTotal(),
                        i.getProduct().getSeller().getId(),
                        i.getProduct().getSeller().getFullName(),
                        i.getProduct().getSeller().getEmail()
                ))
                .toList();

        // Fetch payment if exists
        PaymentDTO paymentDTO = paymentRepo.findByOrder_Id(o.getId())
                .map(p -> new PaymentDTO(p.getId(), p.getOrder().getId(), p.getAmount(), p.getStatus(), p.getMethod(), p.getReference(), p.getPaidAt()))
                .orElse(null);

        return new OrderDTO(
                o.getId(), 
                o.getStatus(), 
                o.getTotalAmount(), 
                o.getCreatedAt(), 
                items,
                o.getBuyer().getId(),
                o.getBuyer().getFullName(),
                o.getBuyer().getEmail(),
                paymentDTO
        );
    }
}
