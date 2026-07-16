package com.storyreading.service.impl;

import com.storyreading.dto.HistoryDto;
import com.storyreading.mapper.HistoryMapper;
import com.storyreading.model.Chapter;
import com.storyreading.model.History;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.repository.ChapterRepository;
import com.storyreading.repository.HistoryRepository;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.HistoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HistoryServiceImpl implements HistoryService {

    private final HistoryRepository historyRepository;
    private final StoryRepository storyRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final HistoryMapper historyMapper;

    public HistoryServiceImpl(HistoryRepository historyRepository,
                              StoryRepository storyRepository,
                              ChapterRepository chapterRepository,
                              UserRepository userRepository,
                              HistoryMapper historyMapper) {
        this.historyRepository = historyRepository;
        this.storyRepository = storyRepository;
        this.chapterRepository = chapterRepository;
        this.userRepository = userRepository;
        this.historyMapper = historyMapper;
    }

    @Override
    public HistoryDto saveReadingHistory(Long storyId, Long chapterId, Integer scrollPosition, Boolean isPrompted, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found"));

        History history = historyRepository.findByUserUserIdAndStoryStoryId(user.getUserId(), storyId)
                .orElse(null);

        if (history == null) {
            history = History.builder()
                    .user(user)
                    .story(story)
                    .chapter(chapter)
                    .scrollPosition(scrollPosition != null ? scrollPosition : 0)
                    .isPrompted(isPrompted != null ? isPrompted : false)
                    .build();
        } else {
            history.setChapter(chapter);
            if (scrollPosition != null) {
                history.setScrollPosition(scrollPosition);
            }
            if (isPrompted != null) {
                history.setIsPrompted(isPrompted);
            }
        }

        History saved = historyRepository.save(history);
        return historyMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HistoryDto> getReadingHistory(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return historyRepository.findByUserUserIdOrderByUpdatedAtDesc(user.getUserId(), pageable)
                .map(historyMapper::toDto);
    }

    @Override
    public void clearReadingHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        historyRepository.deleteByUserUserId(user.getUserId());
    }
}
