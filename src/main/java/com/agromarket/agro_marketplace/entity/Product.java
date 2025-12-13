package com.agromarket.agro_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String name;
    @Column(length = 2000) private String description;

    @Column(nullable = false) private BigDecimal price;
    @Column(nullable = false) private Integer stockQty;

    @ManyToOne(optional = false) private Category category;
    @ManyToOne(optional = false) private User seller; // FARMER
}
