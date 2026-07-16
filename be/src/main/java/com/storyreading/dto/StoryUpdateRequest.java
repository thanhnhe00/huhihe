package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryUpdateRequest {
    private String title;
    private String author;
    private String description;
    private String coverImage;
    private Integer ageRating;
    private List<Long> categoryIds;
}
