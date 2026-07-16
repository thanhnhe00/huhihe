package com.storyreading.repository;

import com.storyreading.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByChapterChapterIdAndParentIsNullAndIsHiddenFalseOrderByCreatedAtDesc(Long chapterId, Pageable pageable);

    Page<Comment> findByStoryStoryIdAndParentIsNullAndIsHiddenFalseOrderByCreatedAtDesc(Long storyId, Pageable pageable);

    List<Comment> findByParentCommentIdAndIsHiddenFalseOrderByCreatedAtAsc(Long parentId);

    Page<Comment> findByIsHiddenFalseOrderByCreatedAtDesc(Pageable pageable);
}
