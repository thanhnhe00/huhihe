package com.storyreading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class StoryReadingApplication {
    public static void main(String[] args) {
        SpringApplication.run(StoryReadingApplication.class, args);
    }
}
