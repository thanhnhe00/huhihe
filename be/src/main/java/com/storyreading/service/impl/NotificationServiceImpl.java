package com.storyreading.service.impl;

import com.storyreading.dto.NotificationDto;
import com.storyreading.mapper.NotificationMapper;
import com.storyreading.model.Follow;
import com.storyreading.model.Notification;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.model.enums.NotificationType;
import com.storyreading.repository.FollowRepository;
import com.storyreading.repository.NotificationRepository;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final StoryRepository storyRepository;
    private final FollowRepository followRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   UserRepository userRepository,
                                   StoryRepository storyRepository,
                                   FollowRepository followRepository,
                                   NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.storyRepository = storyRepository;
        this.followRepository = followRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getNotifications(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(user.getUserId(), pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!notification.getReceiver().getUserId().equals(user.getUserId())) {
            throw new IllegalStateException("You are not authorized to access this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void createNotificationForFollowers(Long storyId, String title, String content, String type) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        // Find all follows of this specific story
        List<Follow> follows = followRepository.findByStoryStoryId(storyId);
        List<Notification> notifications = new ArrayList<>();

        for (Follow f : follows) {
            notifications.add(Notification.builder()
                    .receiver(f.getUser())
                    .story(story)
                    .title(title)
                    .content(content)
                    .type(NotificationType.valueOf(type.toUpperCase()))
                    .isRead(false)
                    .build());
        }

        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        }
    }
}
