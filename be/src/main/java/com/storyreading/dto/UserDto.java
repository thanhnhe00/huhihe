package com.storyreading.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private LocalDate birthDate;
    private String avatarUrl;
    private String role;
    private String status;
    private LocalDateTime lockedUntil;
    private String lockReason;
    private LocalDateTime createdAt;
}
