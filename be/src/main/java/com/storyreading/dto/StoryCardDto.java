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
public class StoryCardDto {
    private Long storyId;
    private String title;
    private String author;
    private String coverImage;
    private String contentType;
    private Double averageRating;
    private List<String> categoryNames;
}
