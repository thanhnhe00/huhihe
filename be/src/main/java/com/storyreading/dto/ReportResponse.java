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
public class ReportResponse {
    private Long reportId;
    private Long reporterId;
    private String reporterName;
    private String targetType;
    private Long targetId;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
}
