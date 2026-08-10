package com.investigation.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.investigation.dto.request.LoginRequest;
import com.investigation.dto.request.RegisterRequest;
import com.investigation.entity.User;
import com.investigation.entity.enums.Role;
import com.investigation.exception.ResourceNotFoundException;
import com.investigation.repository.UserRepository;
import com.investigation.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = parseRole(request.getRole());

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

@Override
public User updateUserRole(Long id, String newRole) {

    User user = getUserById(id);
    Role parsedRole = parseRole(newRole);

    // Prevent removing the last remaining admin account — without this,
    // it's possible to lock every admin out of user management with no
    // recovery path short of a direct DB edit.
    if (user.getRole() == Role.ADMIN && parsedRole != Role.ADMIN) {
        long remainingAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();

        if (remainingAdmins <= 1) {
            throw new RuntimeException("Cannot change role: at least one ADMIN account must remain.");
        }
    }

    user.setRole(parsedRole);
    return userRepository.save(user);
}

@Override
public void deleteUser(Long id) {

    User user = getUserById(id);

    if (user.getRole() == Role.ADMIN) {
        long remainingAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();

        if (remainingAdmins <= 1) {
            throw new RuntimeException("Cannot delete the last remaining ADMIN account.");
        }
    }

    userRepository.delete(user);
}

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException(
                    "Invalid role: " + role + ". Must be one of: ADMIN, INVESTIGATOR, FORENSIC_ANALYST, PROSECUTOR");
        }
    }
}
