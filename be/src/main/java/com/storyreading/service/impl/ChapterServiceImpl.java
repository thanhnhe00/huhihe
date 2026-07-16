package com.storyreading.service.impl;

import com.storyreading.dto.ChapterCreateRequest;
import com.storyreading.dto.ChapterResponse;
import com.storyreading.dto.ChapterUpdateRequest;
import com.storyreading.mapper.ChapterMapper;
import com.storyreading.model.*;
import com.storyreading.model.enums.ContentStatus;
import com.storyreading.model.enums.UserRole;
import com.storyreading.repository.*;
import com.storyreading.service.ChapterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final ChapterImageRepository chapterImageRepository;
    private final ViewLogRepository viewLogRepository;
    private final ChapterMapper chapterMapper;

    public ChapterServiceImpl(ChapterRepository chapterRepository,
                              StoryRepository storyRepository,
                              UserRepository userRepository,
                              ChapterImageRepository chapterImageRepository,
                              ViewLogRepository viewLogRepository,
                              ChapterMapper chapterMapper) {
        this.chapterRepository = chapterRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.chapterImageRepository = chapterImageRepository;
        this.viewLogRepository = viewLogRepository;
        this.chapterMapper = chapterMapper;
    }

    @Override
    public ChapterResponse createChapter(Long storyId, ChapterCreateRequest request, String username) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!story.getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to add chapters to this story");
        }

        // Check if chapter number already exists for this story
        chapterRepository.findByStoryStoryIdAndChapterNumber(storyId, request.getChapterNumber())
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Chapter number " + request.getChapterNumber() + " already exists for this story");
                });

        Chapter chapter = Chapter.builder()
                .story(story)
                .chapterNumber(request.getChapterNumber())
                .title(request.getTitle())
                .content(request.getContent())
                .status(ContentStatus.DRAFT)
                .build();

        Chapter savedChapter = chapterRepository.save(chapter);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ChapterImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ChapterImage.builder()
                        .chapter(savedChapter)
                        .imageUrl(request.getImageUrls().get(i))
                        .pageNumber(i + 1)
                        .build());
            }
            chapterImageRepository.saveAll(images);
            savedChapter.setChapterImages(images);
        }

        return chapterMapper.toDto(savedChapter);
    }

    @Override
    public ChapterResponse updateChapter(Long chapterId, ChapterUpdateRequest request, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!chapter.getStory().getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to update this chapter");
        }

        if (request.getTitle() != null) {
            chapter.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            chapter.setContent(request.getContent());
        }

        // Handle Image Updates if present
        if (request.getImageUrls() != null) {
            // Delete old images
            chapterImageRepository.deleteByChapterChapterId(chapterId);

            List<ChapterImage> newImages = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                newImages.add(ChapterImage.builder()
                        .chapter(chapter)
                        .imageUrl(request.getImageUrls().get(i))
                        .pageNumber(i + 1)
                        .build());
            }
            chapterImageRepository.saveAll(newImages);
            chapter.setChapterImages(newImages);
        }

        // Reset to DRAFT or PENDING depending on rules: "Ràng buộc đặc biệt: Khi một chương truyện đang ở trạng thái đã xuất bản..."
        if (chapter.getStatus() == ContentStatus.PUBLISHED) {
            chapter.setStatus(ContentStatus.PENDING); // Edited published chapters must be re-approved
        } else {
            chapter.setStatus(ContentStatus.DRAFT);
        }

        Chapter updated = chapterRepository.save(chapter);
        return chapterMapper.toDto(updated);
    }

    @Override
    public void deleteChapter(Long chapterId, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!chapter.getStory().getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to delete this chapter");
        }

        // Rule: "xóa chương ở trạng thái Nháp" for creators
        if (chapter.getStatus() == ContentStatus.PUBLISHED && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("Cannot delete published chapters");
        }

        chapterRepository.delete(chapter);
    }

    @Override
    public ChapterResponse publishChapter(Long chapterId, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!chapter.getStory().getCreator().getUserId().equals(user.getUserId()) && user.getRole() == UserRole.READER) {
            throw new IllegalStateException("You are not authorized to publish this chapter");
        }

        chapter.setStatus(ContentStatus.PENDING);
        Chapter saved = chapterRepository.save(chapter);
        return chapterMapper.toDto(saved);
    }

    @Override
    public ChapterResponse approveChapter(Long chapterId, String adminUsername) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        chapter.setStatus(ContentStatus.PUBLISHED);
        chapter.setRejectionReason(null);
        Chapter saved = chapterRepository.save(chapter);
        return chapterMapper.toDto(saved);
    }

    @Override
    public ChapterResponse rejectChapter(Long chapterId, String rejectionReason, String adminUsername) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        chapter.setStatus(ContentStatus.REJECTED);
        chapter.setRejectionReason(rejectionReason);
        Chapter saved = chapterRepository.save(chapter);
        return chapterMapper.toDto(saved);
    }

    @Override
    public ChapterResponse getChapterById(Long chapterId, String username) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        // Only allow viewing if published, or if request user is creator/admin
        boolean isCreatorOrAdmin = false;
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.CREATOR && chapter.getStory().getCreator().getUserId().equals(user.getUserId())) {
                    isCreatorOrAdmin = true;
                }
            }
        }

        if (chapter.getStatus() != ContentStatus.PUBLISHED && !isCreatorOrAdmin) {
            throw new IllegalStateException("Chapter is not public or pending approval");
        }

        // Ghi nhận ViewLog
        User viewUser = username != null ? userRepository.findByUsername(username).orElse(null) : null;
        ViewLog viewLog = ViewLog.builder()
                .story(chapter.getStory())
                .chapter(chapter)
                .user(viewUser)
                .build();
        viewLogRepository.save(viewLog);

        return chapterMapper.toDto(chapter);
    }

    @Override
    @Transactional(readOnly = true)
    public ChapterResponse getChapterByNumber(Long storyId, Integer chapterNumber, String username) {
        Chapter chapter = chapterRepository.findByStoryStoryIdAndChapterNumber(storyId, chapterNumber)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        return getChapterById(chapter.getChapterId(), username);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChapterResponse> getChaptersByStory(Long storyId, String username) {
        boolean isCreatorOrAdmin = false;
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                Story story = storyRepository.findById(storyId).orElse(null);
                if (story != null && (user.getRole() == UserRole.ADMIN || (user.getRole() == UserRole.CREATOR && story.getCreator().getUserId().equals(user.getUserId())))) {
                    isCreatorOrAdmin = true;
                }
            }
        }

        List<Chapter> chapters;
        if (isCreatorOrAdmin) {
            chapters = chapterRepository.findByStoryStoryIdOrderByChapterNumberAsc(storyId);
        } else {
            chapters = chapterRepository.findByStoryStoryIdAndStatusOrderByChapterNumberAsc(storyId, ContentStatus.PUBLISHED);
        }

        return chapters.stream().map(chapterMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChapterResponse> getPendingChapters(Pageable pageable) {
        return chapterRepository.findByStatus(ContentStatus.PENDING, pageable)
                .map(chapterMapper::toDto);
    }
}
