package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.payment.*;
import com.agromarket.agro_marketplace.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

    @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
    @PostMapping
    public ResponseEntity<PaymentDTO> pay(@Valid @RequestBody CreatePaymentRequest req, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(paymentService.pay(req, auth.getName(), isAdmin));
    }

    @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> getByOrder(@PathVariable Long orderId, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(paymentService.getByOrderId(orderId, auth.getName(), isAdmin));
    }
}
