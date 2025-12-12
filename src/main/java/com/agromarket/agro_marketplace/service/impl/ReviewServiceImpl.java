package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.review.*;
import com.agromarket.agro_marketplace.entity.*;
import com.agromarket.agro_marketplace.repository.*;
import com.agromarket.agro_marketplace.service.ReviewService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final OrderRepository orderRepo;

    public ReviewServiceImpl(ReviewRepository reviewRepo, ProductRepository productRepo,
                             UserRepository userRepo, OrderRepository orderRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
    }

    @Override
    public ReviewDTO create(CreateReviewRequest req, String reviewerEmail) {
        User reviewer = userRepo.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        Product product = productRepo.findById(req.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Professional rule: only allow review if buyer has DELIVERED order with this product
        boolean canReview = orderRepo.existsByBuyer_EmailAndStatusAndItems_Product_Id(
                reviewerEmail, OrderStatus.DELIVERED, req.productId()
        );

        if (!canReview) {
            throw new RuntimeException("You can review only after delivery of this product");
        }

        Review review = Review.builder()
                .product(product)
                .reviewer(reviewer)
                .rating(req.rating())
                .comment(req.comment())
                .createdAt(Instant.now())
                .build();

        Review saved = reviewRepo.save(review);
        return toDTO(saved);
    }

    @Override
    public List<ReviewDTO> getByProduct(Long productId) {
        return reviewRepo.findByProduct_Id(productId).stream().map(this::toDTO).toList();
    }

    private ReviewDTO toDTO(Review r) {
        return new ReviewDTO(
                r.getId(),
                r.getProduct().getId(),
                r.getReviewer().getEmail(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        );
    }
}
