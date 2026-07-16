package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryResponse {
    private Long storyId;
    private Long creatorId;
    private String creatorName;
    private String title;
    private String author;
    private String description;
    private String coverImage;
    private Integer ageRating;
    private String contentType;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private List<CategoryDto> categories;
    private Double averageRating;
    private Long followCount;
    private Long viewCount;
}
