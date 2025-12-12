package com.agromarket.agro_marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "messages")
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) private User sender;
    @ManyToOne(optional = false) private User receiver;

    @Column(nullable = false, length = 2000)
    private String content;

    private Instant sentAt;
}
