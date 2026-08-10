package com.investigation.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investigation.dto.response.UserResponse;
import com.investigation.entity.User;
import com.investigation.service.UserService;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')") // class-level: every endpoint here is admin-only by default
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(toResponse(userService.getUserById(id)));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateRole(@PathVariable Long id,
                                                    @RequestBody Map<String, String> body) {

        String newRole = body.get("role");
        User updated = userService.updateUserRole(id, newRole);

        return ResponseEntity.ok(toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name() // Role enum -> String for the DTO
        );
    }
}