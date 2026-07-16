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
public class ReportRequest {
    @NotBlank
    private String targetType; // CHAPTER or COMMENT (ReportTargetType)

    @NotNull
    private Long targetId;

    @NotBlank
    private String reason;
}
