package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryCreateRequest {
    @NotBlank
    private String title;

    private String author;

    private String description;

    private String coverImage;

    @Builder.Default
    private Integer ageRating = 0;

    @NotBlank
    private String contentType; // COMIC or NOVEL (e.g. ContentType enum name)

    private List<Long> categoryIds;
}
