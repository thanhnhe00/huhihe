package com.storyreading.service;

import com.storyreading.dto.HistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HistoryService {
    HistoryDto saveReadingHistory(Long storyId, Long chapterId, Integer scrollPosition, Boolean isPrompted, String username);

    Page<HistoryDto> getReadingHistory(String username, Pageable pageable);

    void clearReadingHistory(String username);
}
