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
public class HistoryDto {
    private Long historyId;
    private Long userId;
    private Long storyId;
    private String storyTitle;
    private String coverImage;
    private Long chapterId;
    private Integer chapterNumber;
    private String chapterTitle;
    private Integer scrollPosition;
    private Boolean isPrompted;
    private LocalDateTime updatedAt;
}
