package com.storyreading.service;

import com.storyreading.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> listCategories();
    CategoryDto createCategory(CategoryDto dto);
    CategoryDto updateCategory(Long categoryId, CategoryDto dto);
    void deleteCategory(Long categoryId);
}
