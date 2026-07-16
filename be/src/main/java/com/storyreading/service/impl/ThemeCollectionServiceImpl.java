package com.storyreading.service.impl;

import com.storyreading.model.Story;
import com.storyreading.model.ThemeCollection;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.ThemeCollectionRepository;
import com.storyreading.service.ThemeCollectionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ThemeCollectionServiceImpl implements ThemeCollectionService {

    private final ThemeCollectionRepository collectionRepository;
    private final StoryRepository storyRepository;

    public ThemeCollectionServiceImpl(ThemeCollectionRepository collectionRepository, StoryRepository storyRepository) {
        this.collectionRepository = collectionRepository;
        this.storyRepository = storyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ThemeCollection> listCollections() {
        return collectionRepository.findAll();
    }

    @Override
    public ThemeCollection createCollection(String name) {
        collectionRepository.findByNameIgnoreCase(name)
                .ifPresent(c -> {
                    throw new IllegalArgumentException("Collection with name " + name + " already exists");
                });

        ThemeCollection collection = ThemeCollection.builder()
                .name(name)
                .build();
        return collectionRepository.save(collection);
    }

    @Override
    public void addStoryToCollection(Long collectionId, Long storyId) {
        ThemeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        if (!collection.getStories().contains(story)) {
            collection.getStories().add(story);
            story.getThemeCollections().add(collection);
            collectionRepository.save(collection);
            storyRepository.save(story);
        }
    }

    @Override
    public void removeStoryFromCollection(Long collectionId, Long storyId) {
        ThemeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        if (collection.getStories().contains(story)) {
            collection.getStories().remove(story);
            story.getThemeCollections().remove(collection);
            collectionRepository.save(collection);
            storyRepository.save(story);
        }
    }

    @Override
    public void deleteCollection(Long collectionId) {
        ThemeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found"));
        collectionRepository.delete(collection);
    }
}
