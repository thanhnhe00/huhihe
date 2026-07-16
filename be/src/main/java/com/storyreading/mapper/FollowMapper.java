package com.storyreading.mapper;

import com.storyreading.dto.FollowDto;
import com.storyreading.model.Follow;
import org.springframework.stereotype.Component;

@Component
public class FollowMapper {

    public FollowDto toDto(Follow follow) {
        if (follow == null) {
            return null;
        }
        return FollowDto.builder()
                .followId(follow.getFollowId())
                .userId(follow.getUser() != null ? follow.getUser().getUserId() : null)
                .storyId(follow.getStory() != null ? follow.getStory().getStoryId() : null)
                .storyTitle(follow.getStory() != null ? follow.getStory().getTitle() : null)
                .coverImage(follow.getStory() != null ? follow.getStory().getCoverImage() : null)
                .followedAt(follow.getFollowedAt())
                .build();
    }
}
