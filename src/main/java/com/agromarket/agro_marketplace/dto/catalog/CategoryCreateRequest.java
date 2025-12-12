package com.agromarket.agro_marketplace.dto.catalog;

import jakarta.validation.constraints.NotBlank;

public record CategoryCreateRequest(@NotBlank String name) {}
