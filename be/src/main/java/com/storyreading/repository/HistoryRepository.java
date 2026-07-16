package com.storyreading.repository;

import com.storyreading.model.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    Optional<History> findByUserUserIdAndStoryStoryId(Long userId, Long storyId);
    Page<History> findByUserUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);
    void deleteByUserUserId(Long userId);
}
