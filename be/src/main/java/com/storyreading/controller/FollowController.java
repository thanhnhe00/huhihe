package com.storyreading.controller;

import com.storyreading.dto.FollowDto;
import com.storyreading.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/follows")
@Tag(name = "Follow Management", description = "Endpoints for following/unfollowing stories and checking follow status.")
public class FollowController {

    private final FollowService followService;

    // Constructor injection
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    @Operation(summary = "Follow a story")
    public ResponseEntity<FollowDto> followStory(@RequestBody FollowDto request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        FollowDto followed = followService.followStory(request.getStoryId(), principal.getName());
        return new ResponseEntity<>(followed, HttpStatus.CREATED);
    }

    @DeleteMapping("/{storyId}")
    @Operation(summary = "Unfollow a story")
    public ResponseEntity<Void> unfollowStory(@PathVariable Long storyId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        followService.unfollowStory(storyId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get list of followed stories with pagination")
    public ResponseEntity<Page<FollowDto>> getFollowedStories(Principal principal, Pageable pageable) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Page<FollowDto> follows = followService.getFollowedStories(principal.getName(), pageable);
        return ResponseEntity.ok(follows);
    }

    @GetMapping("/{storyId}/status")
    @Operation(summary = "Check if user is following a story")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long storyId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(false);
        }
        boolean following = followService.isFollowing(storyId, principal.getName());
        return ResponseEntity.ok(following);
    }
}
