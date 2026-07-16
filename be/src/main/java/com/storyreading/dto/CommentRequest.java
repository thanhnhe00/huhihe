package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {
    private Long chapterId;

    private Long storyId;

    private Long parentId; // For reply nested comment support

    @NotBlank
    private String content;
}
