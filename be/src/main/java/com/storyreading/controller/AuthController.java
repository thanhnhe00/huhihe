package com.storyreading.controller;

import com.storyreading.dto.JwtResponse;
import com.storyreading.dto.LoginRequest;
import com.storyreading.dto.RegisterRequest;
import com.storyreading.dto.UserDto;
import com.storyreading.dto.UserProfileDto;
import com.storyreading.security.JwtTokenProvider;
import com.storyreading.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, token refresh and profile lookup.")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    // Constructor injection
    public AuthController(UserService userService, JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        UserDto registeredUser = userService.register(request);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwtResponse = userService.login(request);
        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh an active JWT token")
    public ResponseEntity<JwtResponse> refresh(
            @RequestHeader(value = "Authorization", required = false) String bearerToken,
            @RequestBody(required = false) Map<String, String> body) {

        String token = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        } else if (body != null && body.containsKey("token")) {
            token = body.get("token");
        }

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = tokenProvider.getUsernameFromToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        String newToken = tokenProvider.generateToken(authentication);
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_READER")
                .replace("ROLE_", "");

        return ResponseEntity.ok(JwtResponse.builder()
                .token(newToken)
                .username(username)
                .role(role)
                .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current logged-in user profile")
    public ResponseEntity<UserProfileDto> getMe(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileDto profile = userService.getProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }
}
