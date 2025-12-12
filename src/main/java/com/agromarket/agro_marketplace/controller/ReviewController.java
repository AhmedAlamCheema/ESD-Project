package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.review.*;
import com.agromarket.agro_marketplace.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping
    public ResponseEntity<ReviewDTO> create(@Valid @RequestBody CreateReviewRequest req, Authentication auth) {
        return ResponseEntity.ok(reviewService.create(req, auth.getName()));
    }

    // Public read (already permitted in SecurityConfig)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> byProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }
}
