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
public class CommentResponse {
    private Long commentId;
    private Long chapterId;
    private Long storyId;
    private Long userId;
    private String username;
    private String avatarUrl;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
