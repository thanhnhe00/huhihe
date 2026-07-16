package com.storyreading.repository;

import com.storyreading.model.Chapter;
import com.storyreading.model.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findByStoryStoryIdOrderByChapterNumberAsc(Long storyId);

    List<Chapter> findByStoryStoryIdAndStatusOrderByChapterNumberAsc(Long storyId, ContentStatus status);

    Optional<Chapter> findByStoryStoryIdAndChapterNumber(Long storyId, Integer chapterNumber);

    Optional<Chapter> findByStoryStoryIdAndChapterNumberAndStatus(Long storyId, Integer chapterNumber, ContentStatus status);

    Page<Chapter> findByStatus(ContentStatus status, Pageable pageable);
}
