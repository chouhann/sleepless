package com.sleepless.controller;

import com.sleepless.dto.JwtAuthenticationResponse;
import com.sleepless.dto.LoginRequest;
import com.sleepless.dto.RegisterRequest;
import com.sleepless.dto.UserResponse;
import com.sleepless.model.User;
import com.sleepless.repository.UserRepository;
import com.sleepless.security.JwtTokenProvider;
import com.sleepless.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getUserType()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email address already in use!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        String userType = registerRequest.getUserType();
        if ("admin".equalsIgnoreCase(userType)) {
            // Check pin code
            if (!"123ABC".equals(registerRequest.getRegistrationCode())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Incorrect administrator pin code!");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            userType = "admin";
        } else {
            userType = "user";
        }

        User user = new User(
                registerRequest.getName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                userType
        );

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        UserResponse userResponse = new UserResponse(
                userPrincipal.getId(),
                userPrincipal.getName(),
                userPrincipal.getEmail(),
                userPrincipal.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? "admin" : "user"
        );
        return ResponseEntity.ok(userResponse);
    }
}
