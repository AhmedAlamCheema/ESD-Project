package com.agromarket.agro_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false) private Order order;

    @Column(nullable = false) private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String method;     // COD, BankTransfer, JazzCash, EasyPaisa
    private String reference;  // transaction id / ref
    private Instant paidAt;
}
