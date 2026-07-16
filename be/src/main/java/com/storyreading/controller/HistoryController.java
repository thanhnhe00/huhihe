package com.storyreading.controller;

import com.storyreading.dto.HistoryDto;
import com.storyreading.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/history")
@Tag(name = "Reading History Management", description = "Endpoints for saving, listing, and clearing reading history.")
public class HistoryController {

    private final HistoryService historyService;

    // Constructor injection
    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @PostMapping
    @Operation(summary = "Save or update current reading progress")
    public ResponseEntity<HistoryDto> saveHistory(@RequestBody HistoryDto request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        HistoryDto saved = historyService.saveReadingHistory(
                request.getStoryId(),
                request.getChapterId(),
                request.getScrollPosition() != null ? request.getScrollPosition() : 0,
                request.getIsPrompted() != null ? request.getIsPrompted() : false,
                principal.getName()
        );
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get user reading history with pagination")
    public ResponseEntity<Page<HistoryDto>> getHistory(Principal principal, Pageable pageable) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Page<HistoryDto> history = historyService.getReadingHistory(principal.getName(), pageable);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping
    @Operation(summary = "Clear all reading history")
    public ResponseEntity<Void> clearHistory(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        historyService.clearReadingHistory(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
