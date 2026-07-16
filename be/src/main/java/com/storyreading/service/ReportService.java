package com.storyreading.service;

import com.storyreading.dto.ReportRequest;
import com.storyreading.dto.ReportResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {
    ReportResponse createReport(ReportRequest request, String username);

    ReportResponse resolveReport(Long reportId, String status, String adminUsername);

    Page<ReportResponse> getPendingReports(Pageable pageable);
}
