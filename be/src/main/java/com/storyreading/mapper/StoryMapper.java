package com.storyreading.mapper;

import com.storyreading.dto.StoryCardDto;
import com.storyreading.dto.StoryResponse;
import com.storyreading.model.Category;
import com.storyreading.model.Story;
import com.storyreading.model.enums.ContentStatus;
import com.storyreading.model.enums.ContentType;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class StoryMapper {

    private final CategoryMapper categoryMapper;

    public StoryMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public StoryResponse toDto(Story story, Double averageRating, Long followCount, Long viewCount) {
        if (story == null) {
            return null;
        }
        return StoryResponse.builder()
                .storyId(story.getStoryId())
                .creatorId(story.getCreator() != null ? story.getCreator().getUserId() : null)
                .creatorName(story.getCreator() != null ? story.getCreator().getUsername() : null)
                .title(story.getTitle())
                .author(story.getAuthor())
                .description(story.getDescription())
                .coverImage(story.getCoverImage())
                .ageRating(story.getAgeRating())
                .contentType(story.getContentType() != null ? story.getContentType().name() : null)
                .status(story.getStatus() != null ? story.getStatus().name() : null)
                .rejectionReason(story.getRejectionReason())
                .createdAt(story.getCreatedAt())
                .categories(story.getCategories() != null ?
                        story.getCategories().stream().map(categoryMapper::toDto).collect(Collectors.toList()) : new ArrayList<>())
                .averageRating(averageRating != null ? averageRating : 0.0)
                .followCount(followCount != null ? followCount : 0L)
                .viewCount(viewCount != null ? viewCount : 0L)
                .build();
    }

    public StoryCardDto toCardDto(Story story, Double averageRating) {
        if (story == null) {
            return null;
        }
        return StoryCardDto.builder()
                .storyId(story.getStoryId())
                .title(story.getTitle())
                .author(story.getAuthor())
                .coverImage(story.getCoverImage())
                .contentType(story.getContentType() != null ? story.getContentType().name() : null)
                .averageRating(averageRating != null ? averageRating : 0.0)
                .categoryNames(story.getCategories() != null ?
                        story.getCategories().stream().map(Category::getName).collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    public Story toEntity(StoryResponse dto) {
        if (dto == null) {
            return null;
        }
        Story story = new Story();
        story.setStoryId(dto.getStoryId());
        story.setTitle(dto.getTitle());
        story.setAuthor(dto.getAuthor());
        story.setDescription(dto.getDescription());
        story.setCoverImage(dto.getCoverImage());
        story.setAgeRating(dto.getAgeRating() != null ? dto.getAgeRating() : 0);
        if (dto.getContentType() != null) {
            story.setContentType(ContentType.valueOf(dto.getContentType()));
        }
        if (dto.getStatus() != null) {
            story.setStatus(ContentStatus.valueOf(dto.getStatus()));
        }
        story.setRejectionReason(dto.getRejectionReason());
        story.setCreatedAt(dto.getCreatedAt());
        story.setCategories(dto.getCategories() != null ?
                dto.getCategories().stream().map(categoryMapper::toEntity).collect(Collectors.toList()) : new ArrayList<>());
        return story;
    }
}
