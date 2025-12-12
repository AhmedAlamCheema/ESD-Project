package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.catalog.*;
import com.agromarket.agro_marketplace.entity.*;
import com.agromarket.agro_marketplace.repository.*;
import com.agromarket.agro_marketplace.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public ProductServiceImpl(ProductRepository productRepo, CategoryRepository categoryRepo, UserRepository userRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

    @Override
    public ProductResponse create(ProductCreateRequest req, String sellerEmail) {
        Category category = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User seller = userRepo.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product saved = productRepo.save(Product.builder()
                .name(req.name())
                .description(req.description())
                .price(req.price())
                .stockQty(req.stockQty())
                .category(category)
                .seller(seller)
                .build());

        return toRes(saved);
    }

    @Override
    public List<ProductResponse> list(Long categoryId, String q) {
        List<Product> products;
        if (categoryId != null) products = productRepo.findByCategory_Id(categoryId);
        else if (q != null && !q.isBlank()) products = productRepo.findByNameContainingIgnoreCase(q);
        else products = productRepo.findAll();

        return products.stream().map(this::toRes).toList();
    }

    @Override
    public ProductResponse get(Long id) {
        return productRepo.findById(id).map(this::toRes)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public ProductResponse update(Long id, ProductCreateRequest req, String sellerEmail) {
        Product p = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!p.getSeller().getEmail().equals(sellerEmail))
            throw new RuntimeException("Only seller can update");

        Category category = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        p.setName(req.name());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setStockQty(req.stockQty());
        p.setCategory(category);

        return toRes(productRepo.save(p));
    }

    @Override
    public void delete(Long id, String sellerEmail, boolean isAdmin) {
        Product p = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (!isAdmin && !p.getSeller().getEmail().equals(sellerEmail))
            throw new RuntimeException("Only seller/admin can delete");
        productRepo.delete(p);
    }

    private ProductResponse toRes(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getStockQty(),
                p.getCategory().getId(), p.getCategory().getName(),
                p.getSeller().getId(), p.getSeller().getFullName()
        );
    }
}
