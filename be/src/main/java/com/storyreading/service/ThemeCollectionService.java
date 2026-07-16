package com.storyreading.service;

import com.storyreading.model.ThemeCollection;
import java.util.List;

public interface ThemeCollectionService {
    List<ThemeCollection> listCollections();
    ThemeCollection createCollection(String name);
    void addStoryToCollection(Long collectionId, Long storyId);
    void removeStoryFromCollection(Long collectionId, Long storyId);
    void deleteCollection(Long collectionId);
}
