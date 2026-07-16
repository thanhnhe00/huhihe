package com.storyreading.service.impl;

import com.storyreading.model.Rating;
import com.storyreading.model.Story;
import com.storyreading.model.User;
import com.storyreading.repository.RatingRepository;
import com.storyreading.repository.StoryRepository;
import com.storyreading.repository.UserRepository;
import com.storyreading.service.RatingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public RatingServiceImpl(RatingRepository ratingRepository,
                             StoryRepository storyRepository,
                             UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void rateStory(Long storyId, Integer score, String username) {
        if (score < 1 || score > 5) {
            throw new IllegalArgumentException("Rating score must be between 1 and 5");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));

        Rating rating = ratingRepository.findByUserUserIdAndStoryStoryId(user.getUserId(), storyId)
                .orElse(null);

        if (rating == null) {
            rating = Rating.builder()
                    .user(user)
                    .story(story)
                    .score(score)
                    .build();
        } else {
            rating.setScore(score);
        }

        ratingRepository.save(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Long storyId) {
        Double avg = ratingRepository.getAverageRatingForStory(storyId);
        return avg != null ? avg : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getUserRatingForStory(Long storyId, String username) {
        if (username == null) {
            return 0;
        }
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return 0;
        }
        return ratingRepository.findByUserUserIdAndStoryStoryId(user.getUserId(), storyId)
                .map(Rating::getScore)
                .orElse(0);
    }
}
