package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscoveryHomeResponse {
    private List<StoryCardDto> latest;
    private List<StoryCardDto> trending;
    private List<StoryCardDto> recommended;
}
