package com.storyreading.repository;

import com.storyreading.model.Story;
import com.storyreading.model.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    Page<Story> findByStatus(ContentStatus status, Pageable pageable);

    @Query("SELECT s FROM Story s WHERE s.status = :status ORDER BY s.createdAt DESC")
    Page<Story> findLatestStories(@Param("status") ContentStatus status, Pageable pageable);

    @Query("SELECT s FROM Story s JOIN s.categories c WHERE s.status = :status AND c.categoryId = :categoryId")
    Page<Story> findByCategoryIdAndStatus(@Param("categoryId") Long categoryId, @Param("status") ContentStatus status, Pageable pageable);

    @Query("SELECT s FROM Story s WHERE s.status = :status AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.author) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Story> searchStories(@Param("keyword") String keyword, @Param("status") ContentStatus status, Pageable pageable);

    @Query("SELECT s FROM Story s JOIN s.themeCollections tc WHERE tc.collectionId = :collectionId AND s.status = :status")
    Page<Story> findByCollectionIdAndStatus(@Param("collectionId") Long collectionId, @Param("status") ContentStatus status, Pageable pageable);

    List<Story> findByCreatorUserId(Long creatorId);
}
