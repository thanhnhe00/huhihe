package com.storyreading.controller;

import com.storyreading.dto.ThemeCollectionDto;
import com.storyreading.model.ThemeCollection;
import com.storyreading.service.ThemeCollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/collections")
@Tag(name = "Theme Collection Management", description = "Endpoints for managing theme collections of stories.")
public class ThemeCollectionController {

    private final ThemeCollectionService collectionService;

    // Constructor injection
    public ThemeCollectionController(ThemeCollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    @Operation(summary = "Get all theme collections")
    public ResponseEntity<List<ThemeCollectionDto>> getAllCollections() {
        List<ThemeCollectionDto> collections = collectionService.listCollections().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(collections);
    }

    @PostMapping
    @Operation(summary = "Create a new theme collection (Admin)")
    public ResponseEntity<ThemeCollectionDto> createCollection(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Collection name is required");
        }
        ThemeCollection created = collectionService.createCollection(name);
        return new ResponseEntity<>(toDto(created), HttpStatus.CREATED);
    }

    @PostMapping("/{collectionId}/stories/{storyId}")
    @Operation(summary = "Add a story to a theme collection (Admin)")
    public ResponseEntity<Void> addStoryToCollection(
            @PathVariable Long collectionId,
            @PathVariable Long storyId) {
        collectionService.addStoryToCollection(collectionId, storyId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{collectionId}/stories/{storyId}")
    @Operation(summary = "Remove a story from a theme collection (Admin)")
    public ResponseEntity<Void> removeStoryFromCollection(
            @PathVariable Long collectionId,
            @PathVariable Long storyId) {
        collectionService.removeStoryFromCollection(collectionId, storyId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{collectionId}")
    @Operation(summary = "Delete an entire theme collection (Admin)")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long collectionId) {
        collectionService.deleteCollection(collectionId);
        return ResponseEntity.noContent().build();
    }

    // Helper mapper to keep raw entities hidden
    private ThemeCollectionDto toDto(ThemeCollection entity) {
        if (entity == null) return null;
        return ThemeCollectionDto.builder()
                .collectionId(entity.getCollectionId())
                .name(entity.getName())
                .build();
    }
}
