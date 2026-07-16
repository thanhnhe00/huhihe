package com.storyreading.mapper;

import com.storyreading.dto.ReportResponse;
import com.storyreading.model.Report;
import com.storyreading.model.enums.ReportStatus;
import com.storyreading.model.enums.ReportTargetType;
import org.springframework.stereotype.Component;

@Component
public class ReportMapper {

    public ReportResponse toDto(Report report) {
        if (report == null) {
            return null;
        }
        return ReportResponse.builder()
                .reportId(report.getReportId())
                .reporterId(report.getReporter() != null ? report.getReporter().getUserId() : null)
                .reporterName(report.getReporter() != null ? report.getReporter().getUsername() : null)
                .targetType(report.getTargetType() != null ? report.getTargetType().name() : null)
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .status(report.getStatus() != null ? report.getStatus().name() : null)
                .createdAt(report.getCreatedAt())
                .build();
    }

    public Report toEntity(ReportResponse dto) {
        if (dto == null) {
            return null;
        }
        Report report = new Report();
        report.setReportId(dto.getReportId());
        if (dto.getTargetType() != null) {
            report.setTargetType(ReportTargetType.valueOf(dto.getTargetType()));
        }
        report.setTargetId(dto.getTargetId());
        report.setReason(dto.getReason());
        if (dto.getStatus() != null) {
            report.setStatus(ReportStatus.valueOf(dto.getStatus()));
        }
        report.setCreatedAt(dto.getCreatedAt());
        return report;
    }
}
