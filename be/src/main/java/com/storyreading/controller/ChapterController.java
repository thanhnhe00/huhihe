package com.storyreading.controller;

import com.storyreading.dto.ChapterCreateRequest;
import com.storyreading.dto.ChapterResponse;
import com.storyreading.dto.ChapterUpdateRequest;
import com.storyreading.service.ChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Chapter Management", description = "Endpoints for creating, retrieving, updating, publishing, and deleting chapters.")
public class ChapterController {

    private final ChapterService chapterService;

    // Constructor injection
    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping("/stories/{storyId}/chapters")
    @Operation(summary = "Get all chapters of a story")
    public ResponseEntity<List<ChapterResponse>> getChaptersByStory(
            @PathVariable Long storyId,
            Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        List<ChapterResponse> chapters = chapterService.getChaptersByStory(storyId, username);
        return ResponseEntity.ok(chapters);
    }

    @GetMapping("/chapters/{id}")
    @Operation(summary = "Get chapter detail by ID")
    public ResponseEntity<ChapterResponse> getChapterById(@PathVariable Long id, Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        ChapterResponse chapter = chapterService.getChapterById(id, username);
        return ResponseEntity.ok(chapter);
    }

    @PostMapping("/stories/{storyId}/chapters")
    @Operation(summary = "Create a new chapter for a story")
    public ResponseEntity<ChapterResponse> createChapter(
            @PathVariable Long storyId,
            @Valid @RequestBody ChapterCreateRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChapterResponse chapter = chapterService.createChapter(storyId, request, principal.getName());
        return new ResponseEntity<>(chapter, HttpStatus.CREATED);
    }

    @PutMapping("/chapters/{id}")
    @Operation(summary = "Update an existing chapter")
    public ResponseEntity<ChapterResponse> updateChapter(
            @PathVariable Long id,
            @Valid @RequestBody ChapterUpdateRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChapterResponse chapter = chapterService.updateChapter(id, request, principal.getName());
        return ResponseEntity.ok(chapter);
    }

    @DeleteMapping("/chapters/{id}")
    @Operation(summary = "Delete an existing chapter")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        chapterService.deleteChapter(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/chapters/{id}/publish")
    @Operation(summary = "Publish a chapter (submitting for review)")
    public ResponseEntity<ChapterResponse> publishChapter(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChapterResponse chapter = chapterService.publishChapter(id, principal.getName());
        return ResponseEntity.ok(chapter);
    }
}
