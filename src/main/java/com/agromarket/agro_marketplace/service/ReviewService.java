package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.review.*;

import java.util.List;

public interface ReviewService {
    ReviewDTO create(CreateReviewRequest req, String reviewerEmail);
    List<ReviewDTO> getByProduct(Long productId);
}
