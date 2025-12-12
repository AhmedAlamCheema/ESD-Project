package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.catalog.CategoryDTO;
import java.util.List;

public interface CategoryService {
    CategoryDTO create(String name);
    List<CategoryDTO> list();
    void delete(Long id);
}
