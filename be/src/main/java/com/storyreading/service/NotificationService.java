package com.storyreading.service;

import com.storyreading.dto.NotificationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    Page<NotificationDto> getNotifications(String username, Pageable pageable);

    void markAsRead(Long notificationId, String username);

    void createNotificationForFollowers(Long storyId, String title, String content, String type);
}
