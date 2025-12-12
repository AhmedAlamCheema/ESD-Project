package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.catalog.CategoryDTO;
import com.agromarket.agro_marketplace.entity.Category;
import com.agromarket.agro_marketplace.repository.CategoryRepository;
import com.agromarket.agro_marketplace.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    public CategoryServiceImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public CategoryDTO create(String name) {
        repo.findByNameIgnoreCase(name).ifPresent(c -> { throw new RuntimeException("Category exists"); });
        Category saved = repo.save(Category.builder().name(name).build());
        return new CategoryDTO(saved.getId(), saved.getName());
    }

    @Override
    public List<CategoryDTO> list() {
        return repo.findAll().stream().map(c -> new CategoryDTO(c.getId(), c.getName())).toList();
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
