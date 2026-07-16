package com.storyreading.controller;

import com.storyreading.dto.RatingRequest;
import com.storyreading.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/ratings")
@Tag(name = "Rating Management", description = "Endpoints for rating stories and getting rating details.")
public class RatingController {

    private final RatingService ratingService;

    // Constructor injection
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @Operation(summary = "Rate a story")
    public ResponseEntity<Void> rateStory(@Valid @RequestBody RatingRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ratingService.rateStory(request.getStoryId(), request.getScore(), principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/story/{storyId}/average")
    @Operation(summary = "Get average rating of a story")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long storyId) {
        Double avg = ratingService.getAverageRating(storyId);
        return ResponseEntity.ok(avg != null ? avg : 0.0);
    }

    @GetMapping("/story/{storyId}/user")
    @Operation(summary = "Get current user rating for a story")
    public ResponseEntity<Integer> getUserRating(@PathVariable Long storyId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(0);
        }
        Integer score = ratingService.getUserRatingForStory(storyId, principal.getName());
        return ResponseEntity.ok(score != null ? score : 0);
    }
}
