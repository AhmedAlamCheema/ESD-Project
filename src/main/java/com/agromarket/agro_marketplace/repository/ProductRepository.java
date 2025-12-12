package com.agromarket.agro_marketplace.repository;

import com.agromarket.agro_marketplace.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_Id(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String q);
}
