package com.storyreading.service;

public interface RatingService {
    void rateStory(Long storyId, Integer score, String username);
    Double getAverageRating(Long storyId);
    Integer getUserRatingForStory(Long storyId, String username);
}
