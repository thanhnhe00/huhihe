package com.storyreading.repository;

import com.storyreading.model.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByUserUserIdAndStoryStoryId(Long userId, Long storyId);
    boolean existsByUserUserIdAndStoryStoryId(Long userId, Long storyId);
    Page<Follow> findByUserUserId(Long userId, Pageable pageable);
    List<Follow> findByStoryStoryId(Long storyId);
    long countByStoryStoryId(Long storyId);
}
