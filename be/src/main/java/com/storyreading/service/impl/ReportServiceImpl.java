package com.storyreading.service.impl;

import com.storyreading.dto.ReportRequest;
import com.storyreading.dto.ReportResponse;
import com.storyreading.mapper.ReportMapper;
import com.storyreading.model.Report;
import com.storyreading.model.User;
import com.storyreading.model.enums.ReportStatus;
import com.storyreading.model.enums.ReportTargetType;
import com.storyreading.repository.ReportRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.ReportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

    public ReportServiceImpl(ReportRepository reportRepository,
                             UserRepository userRepository,
                             ReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public ReportResponse createReport(ReportRequest request, String username) {
        User reporter = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .targetType(ReportTargetType.valueOf(request.getTargetType().toUpperCase()))
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .status(ReportStatus.PENDING)
                .build();

        Report saved = reportRepository.save(report);
        return reportMapper.toDto(saved);
    }

    @Override
    public ReportResponse resolveReport(Long reportId, String status, String adminUsername) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        report.setStatus(ReportStatus.valueOf(status.toUpperCase()));
        Report saved = reportRepository.save(report);
        return reportMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportResponse> getPendingReports(Pageable pageable) {
        return reportRepository.findByStatusOrderByCreatedAtAsc(ReportStatus.PENDING, pageable)
                .map(reportMapper::toDto);
    }
}
