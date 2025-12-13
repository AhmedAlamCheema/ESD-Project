package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.catalog.*;
import com.agromarket.agro_marketplace.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) { this.productService = productService; }

    @PreAuthorize("hasAnyRole('FARMER','ADMIN','SELLER')")
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductCreateRequest req, Authentication auth) {
        return ResponseEntity.ok(productService.create(req, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q
    ) {
        return ResponseEntity.ok(productService.list(categoryId, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(productService.get(id));
    }

    @PreAuthorize("hasRole('FARMER')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ProductCreateRequest req,
                                                  Authentication auth) {
        return ResponseEntity.ok(productService.update(id, req, auth.getName()));
    }

    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        productService.delete(id, auth.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
