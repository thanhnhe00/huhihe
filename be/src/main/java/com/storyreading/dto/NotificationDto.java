package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long notificationId;
    private Long receiverId;
    private Long storyId;
    private String storyTitle;
    private String title;
    private String content;
    private Boolean isRead;
    private String type;
    private LocalDateTime createdAt;
}
