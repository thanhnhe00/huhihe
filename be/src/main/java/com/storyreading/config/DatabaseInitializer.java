package com.storyreading.config;

import com.storyreading.model.User;
import com.storyreading.model.enums.UserRole;
import com.storyreading.model.enums.UserStatus;
import com.storyreading.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeUser("admin", "123456", "admin@storyreading.com", UserRole.ADMIN);
        initializeUser("creator", "123456", "creator@storyreading.com", UserRole.CREATOR);
        initializeUser("reader", "123456", "reader@storyreading.com", UserRole.READER);
    }

    private void initializeUser(String username, String password, String email, UserRole role) {
        if (!userRepository.existsByUsername(username)) {
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .email(email)
                    .birthDate(LocalDate.of(2000, 1, 1))
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(user);
            System.out.println("Initialized user: " + username + " with role: " + role);
        }
    }
}
