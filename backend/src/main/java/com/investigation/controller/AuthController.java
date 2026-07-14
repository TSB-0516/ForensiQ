package com.investigation.controller;

import com.investigation.dto.request.LoginRequest;
import com.investigation.dto.request.RegisterRequest;
import com.investigation.dto.response.LoginResponse;
import com.investigation.jwt.JwtUtil;
import com.investigation.entity.User;
import com.investigation.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        User user = userService.login(request);

        String token = jwtUtil.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

}