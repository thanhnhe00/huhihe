package com.storyreading.controller;

import com.storyreading.dto.CommentRequest;
import com.storyreading.dto.CommentResponse;
import com.storyreading.service.CommentService;
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
@RequestMapping("/api")
@Tag(name = "Comment Management", description = "Endpoints for creating, retrieving, hiding, and deleting comments on chapters.")
public class CommentController {

    private final CommentService commentService;

    // Constructor injection
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comments")
    @Operation(summary = "Post a new comment on a chapter")
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CommentResponse comment = commentService.createComment(request, principal.getName());
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Delete an existing comment")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        commentService.deleteComment(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/comments/{id}/hide")
    @Operation(summary = "Hide a comment (Admin/Moderator)")
    public ResponseEntity<Void> hideComment(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        commentService.hideComment(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/chapters/{chapterId}/comments")
    @Operation(summary = "Get comments of a specific chapter with pagination")
    public ResponseEntity<Page<CommentResponse>> getCommentsByChapter(
            @PathVariable Long chapterId,
            Pageable pageable) {
        Page<CommentResponse> comments = commentService.getCommentsByChapter(chapterId, pageable);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments")
    @Operation(summary = "Get all comments with pagination (Admin/Moderator)")
    public ResponseEntity<Page<CommentResponse>> getAllComments(Pageable pageable) {
        Page<CommentResponse> comments = commentService.getAllComments(pageable);
        return ResponseEntity.ok(comments);
    }
}
