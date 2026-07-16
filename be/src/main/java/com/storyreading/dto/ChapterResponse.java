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
public class ChapterResponse {
    private Long chapterId;
    private Long storyId;
    private Integer chapterNumber;
    private String title;
    private String content;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private List<String> imageUrls;
}
