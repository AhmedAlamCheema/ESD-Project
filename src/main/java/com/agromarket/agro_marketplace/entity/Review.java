package com.agromarket.agro_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) private Product product;
    @ManyToOne(optional = false) private User reviewer;

    private int rating; // 1..5
    @Column(length = 2000) private String comment;
    private Instant createdAt;
}
