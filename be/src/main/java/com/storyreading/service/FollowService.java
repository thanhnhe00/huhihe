package com.storyreading.service;

import com.storyreading.dto.FollowDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
    FollowDto followStory(Long storyId, String username);

    void unfollowStory(Long storyId, String username);

    boolean isFollowing(Long storyId, String username);

    Page<FollowDto> getFollowedStories(String username, Pageable pageable);
}
