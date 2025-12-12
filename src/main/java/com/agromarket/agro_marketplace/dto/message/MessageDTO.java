package com.agromarket.agro_marketplace.dto.message;

import java.time.Instant;

public record MessageDTO(
        Long id,
        String senderEmail,
        String receiverEmail,
        String content,
        Instant sentAt
) {}
