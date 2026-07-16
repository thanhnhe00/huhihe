package com.storyreading.service.impl;

import com.storyreading.dto.CategoryDto;
import com.storyreading.mapper.CategoryMapper;
import com.storyreading.model.Category;
import com.storyreading.repository.CategoryRepository;
import com.storyreading.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> listCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto createCategory(CategoryDto dto) {
        categoryRepository.findByNameIgnoreCase(dto.getName())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Category with name " + dto.getName() + " already exists");
                });

        Category category = Category.builder()
                .name(dto.getName())
                .build();

        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    public CategoryDto updateCategory(Long categoryId, CategoryDto dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        categoryRepository.findByNameIgnoreCase(dto.getName())
                .ifPresent(c -> {
                    if (!c.getCategoryId().equals(categoryId)) {
                        throw new IllegalArgumentException("Category with name " + dto.getName() + " already exists");
                    }
                });

        category.setName(dto.getName());
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        categoryRepository.delete(category);
    }
}
