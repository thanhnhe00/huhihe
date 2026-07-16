package com.storyreading.mapper;

import com.storyreading.dto.RatingRequest;
import com.storyreading.model.Rating;
import org.springframework.stereotype.Component;

@Component
public class RatingMapper {

    public RatingRequest toDto(Rating rating) {
        if (rating == null) {
            return null;
        }
        return RatingRequest.builder()
                .storyId(rating.getStory() != null ? rating.getStory().getStoryId() : null)
                .score(rating.getScore())
                .build();
    }
}
