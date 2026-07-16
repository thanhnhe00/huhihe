package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterCreateRequest {
    @NotNull
    private Integer chapterNumber;

    private String title;

    private String content; // Text for novel chapter

    private List<String> imageUrls; // Images for comic chapter (ordered)
}
