package com.agromarket.agro_marketplace.dto.message;

import jakarta.validation.constraints.*;

public record SendMessageRequest(
        @NotNull Long receiverId,
        @NotBlank String content
) {}
