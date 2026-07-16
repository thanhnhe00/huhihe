package com.storyreading.service.impl;

import com.storyreading.dto.FollowDto;
import com.storyreading.mapper.FollowMapper;
import com.storyreading.model.Follow;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.repository.FollowRepository;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.FollowService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final FollowMapper followMapper;

    public FollowServiceImpl(FollowRepository followRepository,
                             StoryRepository storyRepository,
                             UserRepository userRepository,
                             FollowMapper followMapper) {
        this.followRepository = followRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.followMapper = followMapper;
    }

    @Override
    public FollowDto followStory(Long storyId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        Follow follow = followRepository.findByUserUserIdAndStoryStoryId(user.getUserId(), storyId)
                .orElse(null);

        if (follow == null) {
            follow = Follow.builder()
                    .user(user)
                    .story(story)
                    .build();
            follow = followRepository.save(follow);
        }

        return followMapper.toDto(follow);
    }

    @Override
    public void unfollowStory(Long storyId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Follow follow = followRepository.findByUserUserIdAndStoryStoryId(user.getUserId(), storyId)
                .orElseThrow(() -> new IllegalArgumentException("You are not following this story"));

        followRepository.delete(follow);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(Long storyId, String username) {
        if (username == null) {
            return false;
        }
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return false;
        }
        return followRepository.existsByUserUserIdAndStoryStoryId(user.getUserId(), storyId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowDto> getFollowedStories(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return followRepository.findByUserUserId(user.getUserId(), pageable)
                .map(followMapper::toDto);
    }
}
