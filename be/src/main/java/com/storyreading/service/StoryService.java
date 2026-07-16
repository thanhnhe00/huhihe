package com.storyreading.service;

import com.storyreading.dto.StoryCardDto;
import com.storyreading.dto.StoryCreateRequest;
import com.storyreading.dto.StoryResponse;
import com.storyreading.dto.StoryUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoryService {
    StoryResponse createStory(StoryCreateRequest request, String username);

    StoryResponse updateStory(Long storyId, StoryUpdateRequest request, String username);

    void deleteStory(Long storyId, String username);

    StoryResponse approveStory(Long storyId, String adminUsername);

    StoryResponse rejectStory(Long storyId, String rejectionReason, String adminUsername);

    StoryResponse getStoryById(Long storyId, String username);

    StoryResponse getStoryBySlug(String slug, String username);

    Page<StoryCardDto> searchStories(String keyword, Pageable pageable);

    Page<StoryCardDto> latestStories(Pageable pageable);

    Page<StoryCardDto> trendingStories(String period, Pageable pageable); // period: day, week, month

    Page<StoryCardDto> recommendedStories(String username, Pageable pageable);

    Page<StoryCardDto> getStoriesByCategory(Long categoryId, Pageable pageable);

    Page<StoryCardDto> getStoriesByCollection(Long collectionId, Pageable pageable);
}
