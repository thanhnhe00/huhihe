package com.storyreading.mapper;

import com.storyreading.dto.CategoryDto;
import com.storyreading.model.Category;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class CategoryMapper {

    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .build();
    }

    public Category toEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }
        return Category.builder()
                .categoryId(dto.getCategoryId())
                .name(dto.getName())
                .stories(new ArrayList<>())
                .build();
    }
}
