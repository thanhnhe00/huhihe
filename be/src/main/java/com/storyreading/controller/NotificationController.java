package com.storyreading.controller;

import com.storyreading.dto.NotificationDto;
import com.storyreading.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification Management", description = "Endpoints for retrieving notifications and marking them as read.")
public class NotificationController {

    private final NotificationService notificationService;

    // Constructor injection
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get current user notifications with pagination")
    public ResponseEntity<Page<NotificationDto>> getNotifications(Principal principal, Pageable pageable) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Page<NotificationDto> notifications = notificationService.getNotifications(principal.getName(), pageable);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a specific notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAsRead(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}
