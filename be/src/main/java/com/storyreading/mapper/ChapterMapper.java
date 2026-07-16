package com.storyreading.mapper;

import com.storyreading.dto.ChapterResponse;
import com.storyreading.model.Chapter;
import com.storyreading.model.ChapterImage;
import com.storyreading.model.enums.ContentStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class ChapterMapper {

    public ChapterResponse toDto(Chapter chapter) {
        if (chapter == null) {
            return null;
        }
        return ChapterResponse.builder()
                .chapterId(chapter.getChapterId())
                .storyId(chapter.getStory() != null ? chapter.getStory().getStoryId() : null)
                .chapterNumber(chapter.getChapterNumber())
                .title(chapter.getTitle())
                .content(chapter.getContent())
                .status(chapter.getStatus() != null ? chapter.getStatus().name() : null)
                .rejectionReason(chapter.getRejectionReason())
                .createdAt(chapter.getCreatedAt())
                .imageUrls(chapter.getChapterImages() != null ?
                        chapter.getChapterImages().stream()
                                .map(ChapterImage::getImageUrl)
                                .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    public Chapter toEntity(ChapterResponse dto) {
        if (dto == null) {
            return null;
        }
        Chapter chapter = new Chapter();
        chapter.setChapterId(dto.getChapterId());
        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setTitle(dto.getTitle());
        chapter.setContent(dto.getContent());
        if (dto.getStatus() != null) {
            chapter.setStatus(ContentStatus.valueOf(dto.getStatus()));
        }
        chapter.setRejectionReason(dto.getRejectionReason());
        chapter.setCreatedAt(dto.getCreatedAt());
        return chapter;
    }
}
