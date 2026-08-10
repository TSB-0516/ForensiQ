package com.investigation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investigation.dto.request.LoginRequest;
import com.investigation.dto.request.RegisterRequest;
import com.investigation.dto.response.LoginResponse;
import com.investigation.dto.response.UserResponse;
import com.investigation.entity.User;
import com.investigation.jwt.JwtUtil;
import com.investigation.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        User user = userService.login(request);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }

}
