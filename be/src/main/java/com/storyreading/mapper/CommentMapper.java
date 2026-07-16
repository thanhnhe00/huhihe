package com.storyreading.mapper;

import com.storyreading.dto.CommentResponse;
import com.storyreading.model.Comment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class CommentMapper {

    public CommentResponse toDto(Comment comment) {
        if (comment == null) {
            return null;
        }
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .chapterId(comment.getChapter() != null ? comment.getChapter().getChapterId() : null)
                .storyId(comment.getStory() != null ? comment.getStory().getStoryId() : null)
                .userId(comment.getUser() != null ? comment.getUser().getUserId() : null)
                .username(comment.getUser() != null ? comment.getUser().getUsername() : null)
                .avatarUrl(comment.getUser() != null ? comment.getUser().getAvatarUrl() : null)
                .content(comment.getIsHidden() ? "Bình luận này đã bị ẩn do vi phạm tiêu chuẩn cộng đồng." : comment.getContent())
                .createdAt(comment.getCreatedAt())
                .replies(comment.getReplies() != null ?
                        comment.getReplies().stream()
                                .filter(r -> r != null && !r.getIsHidden())
                                .map(this::toDto)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    public Comment toEntity(CommentResponse dto) {
        if (dto == null) {
            return null;
        }
        Comment comment = new Comment();
        comment.setCommentId(dto.getCommentId());
        comment.setContent(dto.getContent());
        comment.setCreatedAt(dto.getCreatedAt());
        return comment;
    }
}
