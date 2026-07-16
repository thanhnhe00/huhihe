package com.storyreading.repository;

import com.storyreading.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserUserIdAndStoryStoryId(Long userId, Long storyId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.story.storyId = :storyId")
    Double getAverageRatingForStory(@Param("storyId") Long storyId);

    Long countByStoryStoryId(Long storyId);
}
