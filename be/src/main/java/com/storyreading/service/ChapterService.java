package com.storyreading.service;

import com.storyreading.dto.ChapterCreateRequest;
import com.storyreading.dto.ChapterResponse;
import com.storyreading.dto.ChapterUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChapterService {
    ChapterResponse createChapter(Long storyId, ChapterCreateRequest request, String username);

    ChapterResponse updateChapter(Long chapterId, ChapterUpdateRequest request, String username);

    void deleteChapter(Long chapterId, String username);

    ChapterResponse publishChapter(Long chapterId, String username); // submitting for review / PENDING

    ChapterResponse approveChapter(Long chapterId, String adminUsername);

    ChapterResponse rejectChapter(Long chapterId, String rejectionReason, String adminUsername);

    ChapterResponse getChapterById(Long chapterId, String username);

    ChapterResponse getChapterByNumber(Long storyId, Integer chapterNumber, String username);

    List<ChapterResponse> getChaptersByStory(Long storyId, String username);

    Page<ChapterResponse> getPendingChapters(Pageable pageable);
}
