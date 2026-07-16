package com.storyreading.controller;

import com.storyreading.dto.ReportRequest;
import com.storyreading.dto.ReportResponse;
import com.storyreading.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Report Management", description = "Endpoints for creating and resolving content violation reports.")
public class ReportController {

    private final ReportService reportService;

    // Constructor injection
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    @Operation(summary = "Submit a violation report for content (story, chapter, or comment)")
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody ReportRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReportResponse response = reportService.createReport(request, principal.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all pending reports with pagination (Admin/Moderator)")
    public ResponseEntity<Page<ReportResponse>> getPendingReports(Pageable pageable) {
        Page<ReportResponse> reports = reportService.getPendingReports(pageable);
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Resolve a violation report (Admin/Moderator)")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @RequestParam String status,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReportResponse response = reportService.resolveReport(id, status, principal.getName());
        return ResponseEntity.ok(response);
    }
}
