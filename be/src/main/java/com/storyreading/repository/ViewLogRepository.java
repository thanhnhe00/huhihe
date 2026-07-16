package com.storyreading.repository;

import com.storyreading.model.ViewLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ViewLogRepository extends JpaRepository<ViewLog, Long> {
    long countByStoryStoryId(Long storyId);

    @Query("SELECT COUNT(v) FROM ViewLog v WHERE v.story.storyId = :storyId AND v.viewedAt >= :since")
    long countByStoryStoryIdAndViewedAtAfter(@Param("storyId") Long storyId, @Param("since") LocalDateTime since);
}
