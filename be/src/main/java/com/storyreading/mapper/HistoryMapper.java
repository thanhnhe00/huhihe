package com.storyreading.mapper;

import com.storyreading.dto.HistoryDto;
import com.storyreading.model.History;
import org.springframework.stereotype.Component;

@Component
public class HistoryMapper {

    public HistoryDto toDto(History history) {
        if (history == null) {
            return null;
        }
        return HistoryDto.builder()
                .historyId(history.getHistoryId())
                .userId(history.getUser() != null ? history.getUser().getUserId() : null)
                .storyId(history.getStory() != null ? history.getStory().getStoryId() : null)
                .storyTitle(history.getStory() != null ? history.getStory().getTitle() : null)
                .coverImage(history.getStory() != null ? history.getStory().getCoverImage() : null)
                .chapterId(history.getChapter() != null ? history.getChapter().getChapterId() : null)
                .chapterNumber(history.getChapter() != null ? history.getChapter().getChapterNumber() : null)
                .chapterTitle(history.getChapter() != null ? history.getChapter().getTitle() : null)
                .scrollPosition(history.getScrollPosition())
                .isPrompted(history.getIsPrompted())
                .updatedAt(history.getUpdatedAt())
                .build();
    }
}
