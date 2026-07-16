package com.storyreading.service.impl;

import com.storyreading.dto.CommentRequest;
import com.storyreading.dto.CommentResponse;
import com.storyreading.mapper.CommentMapper;
import com.storyreading.model.Chapter;
import com.storyreading.model.Comment;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.model.enums.UserRole;
import com.storyreading.repository.ChapterRepository;
import com.storyreading.repository.CommentRepository;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ChapterRepository chapterRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public CommentServiceImpl(CommentRepository commentRepository,
                              ChapterRepository chapterRepository,
                              StoryRepository storyRepository,
                              UserRepository userRepository,
                              CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.chapterRepository = chapterRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
    }

    @Override
    public CommentResponse createComment(CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Chapter chapter = null;
        Story story = null;

        if (request.getStoryId() != null) {
            story = storyRepository.findById(request.getStoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Story not found"));
        } else if (request.getChapterId() != null) {
            chapter = chapterRepository.findById(request.getChapterId())
                    .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));
        } else {
            throw new IllegalArgumentException("Either storyId or chapterId must be provided");
        }

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));
        }

        // Apply rules: comment length limit
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (request.getContent().length() > 1000) {
            throw new IllegalArgumentException("Comment is too long (Max 1000 characters)");
        }

        Comment comment = Comment.builder()
                .chapter(chapter)
                .story(story)
                .user(user)
                .parent(parent)
                .content(request.getContent())
                .isHidden(false)
                .build();

        Comment saved = commentRepository.save(comment);
        return commentMapper.toDto(saved);
    }

    @Override
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Only the owner or Admin can delete
        if (!comment.getUser().getUserId().equals(user.getUserId()) && user.getRole() != UserRole.ADMIN) {
            throw new IllegalStateException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    public void hideComment(Long commentId, String adminUsername) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        comment.setIsHidden(true);
        commentRepository.save(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByChapter(Long chapterId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByChapterChapterIdAndParentIsNullAndIsHiddenFalseOrderByCreatedAtDesc(chapterId, pageable);
        return comments.map(comment -> {
            CommentResponse resp = commentMapper.toDto(comment);
            // Fetch nested replies if needed, done automatically in mapper if replies collection is populated
            return resp;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByStory(Long storyId, Pageable pageable) {
        Page<Comment> comments = commentRepository.findByStoryStoryIdAndParentIsNullAndIsHiddenFalseOrderByCreatedAtDesc(storyId, pageable);
        return comments.map(commentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getAllComments(Pageable pageable) {
        return commentRepository.findByIsHiddenFalseOrderByCreatedAtDesc(pageable)
                .map(commentMapper::toDto);
    }
}
