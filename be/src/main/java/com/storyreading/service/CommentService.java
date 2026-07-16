package com.storyreading.service;

import com.storyreading.dto.CommentRequest;
import com.storyreading.dto.CommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {
    CommentResponse createComment(CommentRequest request, String username);

    void deleteComment(Long commentId, String username);

    void hideComment(Long commentId, String adminUsername);

    Page<CommentResponse> getCommentsByChapter(Long chapterId, Pageable pageable);

    Page<CommentResponse> getAllComments(Pageable pageable);
}
