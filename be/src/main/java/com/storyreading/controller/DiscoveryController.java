package com.storyreading.controller;

import com.storyreading.dto.DiscoveryHomeResponse;
import com.storyreading.dto.StoryCardDto;
import com.storyreading.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/discovery")
@Tag(name = "Discovery & Search", description = "Endpoints for search, ranking, and consolidated home view data.")
public class DiscoveryController {

    private final StoryService storyService;

    // Constructor injection
    public DiscoveryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping("/home")
    @Operation(summary = "Get consolidated home page data (latest, trending, and recommendations)")
    public ResponseEntity<DiscoveryHomeResponse> getHome(Principal principal) {
        String username = (principal != null) ? principal.getName() : null;

        // Retrieve first 10 items for home sections
        Pageable limitTen = PageRequest.of(0, 10);
        List<StoryCardDto> latest = storyService.latestStories(limitTen).getContent();
        List<StoryCardDto> trending = storyService.trendingStories("month", limitTen).getContent();
        List<StoryCardDto> recommended = storyService.recommendedStories(username, limitTen).getContent();

        DiscoveryHomeResponse response = DiscoveryHomeResponse.builder()
                .latest(latest)
                .trending(trending)
                .recommended(recommended)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search for stories by keyword with pagination")
    public ResponseEntity<Page<StoryCardDto>> search(
            @RequestParam String keyword,
            Pageable pageable) {
        Page<StoryCardDto> results = storyService.searchStories(keyword, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/ranking")
    @Operation(summary = "Get ranked trending stories by period with pagination")
    public ResponseEntity<Page<StoryCardDto>> ranking(
            @RequestParam(defaultValue = "month") String period,
            Pageable pageable) {
        Page<StoryCardDto> results = storyService.trendingStories(period, pageable);
        return ResponseEntity.ok(results);
    }
}
