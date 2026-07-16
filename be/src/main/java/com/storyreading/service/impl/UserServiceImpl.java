package com.storyreading.service.impl;

import com.storyreading.dto.JwtResponse;
import com.storyreading.dto.LoginRequest;
import com.storyreading.dto.RegisterRequest;
import com.storyreading.dto.UserDto;
import com.storyreading.dto.UserProfileDto;
import com.storyreading.mapper.UserMapper;
import com.storyreading.model.User;
import com.storyreading.model.enums.UserRole;
import com.storyreading.model.enums.UserStatus;
import com.storyreading.repository.UserRepository;
import com.storyreading.security.JwtTokenProvider;
import com.storyreading.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserServiceImpl(UserRepository userRepository,
                           UserMapper userMapper,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .birthDate(request.getBirthDate())
                .role(UserRole.READER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (user.getStatus() == UserStatus.LOCKED) {
            if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
                throw new IllegalStateException("Your account is locked until " + user.getLockedUntil() + ". Reason: " + user.getLockReason());
            } else {
                // Lock expired, activate user again
                user.setStatus(UserStatus.ACTIVE);
                user.setLockedUntil(null);
                user.setLockReason(null);
                userRepository.save(user);
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return JwtResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userMapper.toProfileDto(user);
    }

    @Override
    public UserProfileDto updateProfile(String username, UserProfileDto request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getEmail() != null && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email is already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toProfileDto(updatedUser);
    }

    @Override
    public void lockUser(Long userId, String reason, int days) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.LOCKED);
        user.setLockedUntil(LocalDateTime.now().plusDays(days));
        user.setLockReason(reason);
        userRepository.save(user);
    }

    @Override
    public void unlockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.ACTIVE);
        user.setLockedUntil(null);
        user.setLockReason(null);
        userRepository.save(user);
    }
}
