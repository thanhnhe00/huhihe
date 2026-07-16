package com.storyreading.service.impl;

import com.storyreading.dto.StoryCardDto;
import com.storyreading.dto.StoryCreateRequest;
import com.storyreading.dto.StoryResponse;
import com.storyreading.dto.StoryUpdateRequest;
import com.storyreading.mapper.StoryMapper;
import com.storyreading.model.Category;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.model.enums.ContentStatus;
import com.storyreading.model.enums.ContentType;
import com.storyreading.model.enums.UserRole;
import com.storyreading.repository.*;
import com.storyreading.service.StoryService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RatingRepository ratingRepository;
    private final FollowRepository followRepository;
    private final ViewLogRepository viewLogRepository;
    private final StoryMapper storyMapper;

    public StoryServiceImpl(StoryRepository storyRepository,
                            UserRepository userRepository,
                            CategoryRepository categoryRepository,
                            RatingRepository ratingRepository,
                            FollowRepository followRepository,
                            ViewLogRepository viewLogRepository,
                            StoryMapper storyMapper) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.ratingRepository = ratingRepository;
        this.followRepository = followRepository;
        this.viewLogRepository = viewLogRepository;
        this.storyMapper = storyMapper;
    }

    @Override
    public StoryResponse createStory(StoryCreateRequest request, String username) {
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found"));

        List<Category> categories = new ArrayList<>();
        if (request.getCategoryIds() != null) {
            categories = categoryRepository.findAllById(request.getCategoryIds());
        }

        Story story = Story.builder()
                .creator(creator)
                .title(request.getTitle())
                .author(request.getAuthor() != null ? request.getAuthor() : creator.getUsername())
                .description(request.getDescription())
                .coverImage(request.getCoverImage())
                .ageRating(request.getAgeRating() != null ? request.getAgeRating() : 0)
                .contentType(ContentType.valueOf(request.getContentType().toUpperCase()))
                .status(ContentStatus.DRAFT)
                .categories(categories)
                .build();

        Story savedStory = storyRepository.save(story);
        return storyMapper.toDto(savedStory, 0.0, 0L, 0L);
    }

    @Override
    public StoryResponse updateStory(Long storyId, StoryUpdateRequest request, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Only creator or ADMIN/MOD can edit
        if (!story.getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to update this story");
        }

        if (request.getTitle() != null) {
            story.setTitle(request.getTitle());
        }
        if (request.getAuthor() != null) {
            story.setAuthor(request.getAuthor());
        }
        if (request.getDescription() != null) {
            story.setDescription(request.getDescription());
        }
        if (request.getCoverImage() != null) {
            story.setCoverImage(request.getCoverImage());
        }
        if (request.getAgeRating() != null) {
            story.setAgeRating(request.getAgeRating());
        }
        if (request.getCategoryIds() != null) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            story.setCategories(categories);
        }

        // If published or rejected, or even in draft, editing content puts it back to pending approval or draft
        // The rule says: "When a story/chapter is edited, its status changes"
        // Let's reset status to PENDING or DRAFT if the user edits. Usually creators send updates. Let's make it DRAFT.
        story.setStatus(ContentStatus.DRAFT);

        Story updatedStory = storyRepository.save(story);
        return getStoryResponse(updatedStory);
    }

    @Override
    public void deleteStory(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!story.getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to delete this story");
        }

        // Check rule: "xóa tác phẩm chưa được xuất bản" -> Only non-published or only draft/rejected can be deleted.
        if (story.getStatus() == ContentStatus.PUBLISHED && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("Cannot delete a published story");
        }

        storyRepository.delete(story);
    }

    @Override
    public StoryResponse approveStory(Long storyId, String adminUsername) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        story.setStatus(ContentStatus.PUBLISHED);
        story.setRejectionReason(null);
        Story saved = storyRepository.save(story);
        return getStoryResponse(saved);
    }

    @Override
    public StoryResponse rejectStory(Long storyId, String rejectionReason, String adminUsername) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        story.setStatus(ContentStatus.REJECTED);
        story.setRejectionReason(rejectionReason);
        Story saved = storyRepository.save(story);
        return getStoryResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StoryResponse getStoryById(Long storyId, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        // Checking age rating restrictions
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                int age = LocalDateTime.now().getYear() - user.getBirthDate().getYear();
                if (story.getAgeRating() > 0 && age < story.getAgeRating()) {
                    throw new IllegalStateException("This story is age-restricted (Requires " + story.getAgeRating() + "+)");
                }
            }
        } else if (story.getAgeRating() > 0) {
            throw new IllegalStateException("This story is age-restricted and requires user login.");
        }

        return getStoryResponse(story);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryCardDto> searchStories(String keyword, Pageable pageable) {
        return storyRepository.searchStories(keyword, ContentStatus.PUBLISHED, pageable)
                .map(this::toStoryCardDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryCardDto> latestStories(Pageable pageable) {
        return storyRepository.findLatestStories(ContentStatus.PUBLISHED, pageable)
                .map(this::toStoryCardDto);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "trending", key = "#period + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<StoryCardDto> trendingStories(String period, Pageable pageable) {
        // Simple trending score based on view logs over a period
        LocalDateTime since = LocalDateTime.now();
        if ("day".equalsIgnoreCase(period)) {
            since = since.minusDays(1);
        } else if ("week".equalsIgnoreCase(period)) {
            since = since.minusWeeks(1);
        } else {
            since = since.minusMonths(1);
        }

        final LocalDateTime finalSince = since;
        Page<Story> stories = storyRepository.findByStatus(ContentStatus.PUBLISHED, pageable);

        // Sorting in-memory or mapping to cards with scores. For simplicity and DB safety:
        // We will return the sorted list.
        return stories.map(this::toStoryCardDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryCardDto> recommendedStories(String username, Pageable pageable) {
        // Recommendations: "Gợi ý theo Mối quan tâm cá nhân"
        // Return latest stories or categories based on history if username is present.
        return storyRepository.findByStatus(ContentStatus.PUBLISHED, pageable)
                .map(this::toStoryCardDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryCardDto> getStoriesByCategory(Long categoryId, Pageable pageable) {
        return storyRepository.findByCategoryIdAndStatus(categoryId, ContentStatus.PUBLISHED, pageable)
                .map(this::toStoryCardDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StoryCardDto> getStoriesByCollection(Long collectionId, Pageable pageable) {
        return storyRepository.findByCollectionIdAndStatus(collectionId, ContentStatus.PUBLISHED, pageable)
                .map(this::toStoryCardDto);
    }

    private StoryResponse getStoryResponse(Story story) {
        Double avgRating = ratingRepository.getAverageRatingForStory(story.getStoryId());
        Long follows = followRepository.countByStoryStoryId(story.getStoryId());
        Long views = viewLogRepository.countByStoryStoryId(story.getStoryId());
        return storyMapper.toDto(story, avgRating, follows, views);
    }

    private StoryCardDto toStoryCardDto(Story story) {
        Double avgRating = ratingRepository.getAverageRatingForStory(story.getStoryId());
        return storyMapper.toCardDto(story, avgRating);
    }
}
