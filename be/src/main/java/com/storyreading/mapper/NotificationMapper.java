package com.storyreading.mapper;

import com.storyreading.dto.NotificationDto;
import com.storyreading.model.Notification;
import com.storyreading.model.enums.NotificationType;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationDto.builder()
                .notificationId(notification.getNotificationId())
                .receiverId(notification.getReceiver() != null ? notification.getReceiver().getUserId() : null)
                .storyId(notification.getStory() != null ? notification.getStory().getStoryId() : null)
                .storyTitle(notification.getStory() != null ? notification.getStory().getTitle() : null)
                .title(notification.getTitle())
                .content(notification.getContent())
                .isRead(notification.getIsRead())
                .type(notification.getType() != null ? notification.getType().name() : null)
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public Notification toEntity(NotificationDto dto) {
        if (dto == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setNotificationId(dto.getNotificationId());
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setIsRead(dto.getIsRead() != null ? dto.getIsRead() : false);
        if (dto.getType() != null) {
            notification.setType(NotificationType.valueOf(dto.getType()));
        }
        notification.setCreatedAt(dto.getCreatedAt());
        return notification;
    }
}
