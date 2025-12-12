package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.catalog.*;
import java.util.List;

public interface ProductService {
    ProductResponse create(ProductCreateRequest req, String sellerEmail);
    List<ProductResponse> list(Long categoryId, String q);
    ProductResponse get(Long id);
    ProductResponse update(Long id, ProductCreateRequest req, String sellerEmail);
    void delete(Long id, String sellerEmail, boolean isAdmin);
}
