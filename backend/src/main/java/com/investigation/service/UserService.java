package com.investigation.service;

import java.util.List;

import com.investigation.dto.request.LoginRequest;
import com.investigation.dto.request.RegisterRequest;
import com.investigation.entity.User;

public interface UserService {

    User register(RegisterRequest request);

    User login(LoginRequest request);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUserRole(Long id, String newRole);

    void deleteUser(Long id);
}
