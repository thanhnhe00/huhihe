package com.storyreading.controller;

import com.storyreading.dto.UserProfileDto;
import com.storyreading.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Endpoints for updating user profile, locking and unlocking accounts.")
public class UserController {

    private final UserService userService;

    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UserProfileDto request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileDto updatedProfile = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/{userId}/lock")
    @Operation(summary = "Lock a user account (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> lockUser(
            @PathVariable Long userId,
            @RequestParam String reason,
            @RequestParam int days) {
        userService.lockUser(userId, reason, days);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/unlock")
    @Operation(summary = "Unlock a user account (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unlockUser(@PathVariable Long userId) {
        userService.unlockUser(userId);
        return ResponseEntity.ok().build();
    }
}
