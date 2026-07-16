package com.storyreading.service;

import com.storyreading.dto.JwtResponse;
import com.storyreading.dto.LoginRequest;
import com.storyreading.dto.RegisterRequest;
import com.storyreading.dto.UserDto;
import com.storyreading.dto.UserProfileDto;

public interface UserService {
    UserDto register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    UserProfileDto getProfile(String username);
    UserProfileDto updateProfile(String username, UserProfileDto request);

    // For admin / audit purposes or security checks
    void lockUser(Long userId, String reason, int days);
    void unlockUser(Long userId);
}
