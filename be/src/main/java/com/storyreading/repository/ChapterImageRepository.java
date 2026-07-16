package com.storyreading.repository;

import com.storyreading.model.ChapterImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterImageRepository extends JpaRepository<ChapterImage, Long> {
    List<ChapterImage> findByChapterChapterIdOrderByPageNumberAsc(Long chapterId);
    void deleteByChapterChapterId(Long chapterId);
}
