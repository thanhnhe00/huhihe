package com.storyreading.mapper;

import com.storyreading.dto.UserDto;
import com.storyreading.dto.UserProfileDto;
import com.storyreading.model.User;
import com.storyreading.model.enums.UserRole;
import com.storyreading.model.enums.UserStatus;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .lockedUntil(user.getLockedUntil())
                .lockReason(user.getLockReason())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserProfileDto toProfileDto(User user) {
        if (user == null) {
            return null;
        }
        return UserProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .birthDate(user.getBirthDate())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    public User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setBirthDate(dto.getBirthDate());
        user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getRole() != null) {
            user.setRole(UserRole.valueOf(dto.getRole()));
        }
        if (dto.getStatus() != null) {
            user.setStatus(UserStatus.valueOf(dto.getStatus()));
        }
        user.setLockedUntil(dto.getLockedUntil());
        user.setLockReason(dto.getLockReason());
        user.setCreatedAt(dto.getCreatedAt());
        return user;
    }
}
