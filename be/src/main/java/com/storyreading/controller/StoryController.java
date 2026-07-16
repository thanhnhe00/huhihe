package com.storyreading.controller;

import com.storyreading.dto.StoryCardDto;
import com.storyreading.dto.StoryCreateRequest;
import com.storyreading.dto.StoryResponse;
import com.storyreading.dto.StoryUpdateRequest;
import com.storyreading.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/stories")
@Tag(name = "Story Management", description = "Endpoints for creating, retrieving, updating and deleting stories.")
public class StoryController {

    private final StoryService storyService;

    // Constructor injection
    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    @Operation(summary = "Search and list stories with pagination")
    public ResponseEntity<Page<StoryCardDto>> getAllStories(
            @RequestParam(value = "search", required = false, defaultValue = "") String search,
            Pageable pageable) {
        Page<StoryCardDto> stories = storyService.searchStories(search, pageable);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest stories with pagination")
    public ResponseEntity<Page<StoryCardDto>> getLatestStories(Pageable pageable) {
        Page<StoryCardDto> stories = storyService.latestStories(pageable);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending stories by period with pagination")
    public ResponseEntity<Page<StoryCardDto>> getTrendingStories(
            @RequestParam(value = "period", required = false, defaultValue = "month") String period,
            Pageable pageable) {
        Page<StoryCardDto> stories = storyService.trendingStories(period, pageable);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get recommended stories based on current user context")
    public ResponseEntity<Page<StoryCardDto>> getRecommendedStories(Principal principal, Pageable pageable) {
        String username = (principal != null) ? principal.getName() : null;
        Page<StoryCardDto> stories = storyService.recommendedStories(username, pageable);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a story by ID")
    public ResponseEntity<StoryResponse> getStoryById(@PathVariable Long id, Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        StoryResponse story = storyService.getStoryById(id, username);
        return ResponseEntity.ok(story);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get details of a story by unique slug")
    public ResponseEntity<StoryResponse> getStoryBySlug(@PathVariable String slug, Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        StoryResponse story = storyService.getStoryBySlug(slug, username);
        return ResponseEntity.ok(story);
    }

    @PostMapping
    @Operation(summary = "Create a new story (Creator/Admin)")
    public ResponseEntity<StoryResponse> createStory(@Valid @RequestBody StoryCreateRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        StoryResponse story = storyService.createStory(request, principal.getName());
        return new ResponseEntity<>(story, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing story (Creator/Admin)")
    public ResponseEntity<StoryResponse> updateStory(
            @PathVariable Long id,
            @Valid @RequestBody StoryUpdateRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        StoryResponse story = storyService.updateStory(id, request, principal.getName());
        return ResponseEntity.ok(story);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing story (Creator/Admin)")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        storyService.deleteStory(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get stories by category with pagination")
    public ResponseEntity<Page<StoryCardDto>> getStoriesByCategory(@PathVariable Long categoryId, Pageable pageable) {
        Page<StoryCardDto> stories = storyService.getStoriesByCategory(categoryId, pageable);
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/collection/{collectionId}")
    @Operation(summary = "Get stories by collection with pagination")
    public ResponseEntity<Page<StoryCardDto>> getStoriesByCollection(@PathVariable Long collectionId, Pageable pageable) {
        Page<StoryCardDto> stories = storyService.getStoriesByCollection(collectionId, pageable);
        return ResponseEntity.ok(stories);
    }
}
