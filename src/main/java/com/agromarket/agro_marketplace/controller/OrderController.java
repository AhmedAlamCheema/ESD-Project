package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.order.*;
import com.agromarket.agro_marketplace.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping
    public ResponseEntity<OrderDTO> create(@Valid @RequestBody CreateOrderRequest req, Authentication auth) {
        return ResponseEntity.ok(orderService.create(req, auth.getName()));
    }

    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> my(Authentication auth) {
        return ResponseEntity.ok(orderService.myOrders(auth.getName()));
    }

    @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> get(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(orderService.getById(id, auth.getName(), isAdmin));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest req) {
        return ResponseEntity.ok(orderService.updateStatus(id, req.status()));
    }
}
