package com.agromarket.agro_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) private Order order;
    @ManyToOne(optional = false) private Product product;

    @Column(nullable = false) private Integer quantity;
    @Column(nullable = false) private BigDecimal unitPrice;
    @Column(nullable = false) private BigDecimal lineTotal;
}
