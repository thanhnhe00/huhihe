package com.storyreading.controller;

import com.storyreading.dto.ChapterResponse;
import com.storyreading.dto.StoryResponse;
import com.storyreading.service.ChapterService;
import com.storyreading.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/moderation")
@Tag(name = "Content Moderation", description = "Endpoints for Admin/Moderators to approve or reject stories and chapters.")
public class ModerationController {

    private final StoryService storyService;
    private final ChapterService chapterService;

    // Constructor injection
    public ModerationController(StoryService storyService, ChapterService chapterService) {
        this.storyService = storyService;
        this.chapterService = chapterService;
    }

    @PutMapping("/story/{id}/approve")
    @Operation(summary = "Approve a story, making it published and visible")
    public ResponseEntity<StoryResponse> approveStory(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        StoryResponse approved = storyService.approveStory(id, principal.getName());
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/story/{id}/reject")
    @Operation(summary = "Reject a story with a reason")
    public ResponseEntity<StoryResponse> rejectStory(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Violates community guidelines") String reason,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        StoryResponse rejected = storyService.rejectStory(id, reason, principal.getName());
        return ResponseEntity.ok(rejected);
    }

    @PutMapping("/chapter/{id}/approve")
    @Operation(summary = "Approve a chapter, publishing it to the story")
    public ResponseEntity<ChapterResponse> approveChapter(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ChapterResponse approved = chapterService.approveChapter(id, principal.getName());
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/chapter/{id}/reject")
    @Operation(summary = "Reject a chapter with a reason")
    public ResponseEntity<ChapterResponse> rejectChapter(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Violates community guidelines") String reason,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        ChapterResponse rejected = chapterService.rejectChapter(id, reason, principal.getName());
        return ResponseEntity.ok(rejected);
    }
}
