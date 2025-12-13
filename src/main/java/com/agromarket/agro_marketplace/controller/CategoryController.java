package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.catalog.CategoryCreateRequest;
import com.agromarket.agro_marketplace.dto.catalog.CategoryDTO;
import com.agromarket.agro_marketplace.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) { this.categoryService = categoryService; }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CategoryDTO> create(@Valid @RequestBody CategoryCreateRequest req) {
        return ResponseEntity.ok(categoryService.create(req.name()));
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> list() {
        return ResponseEntity.ok(categoryService.list());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
