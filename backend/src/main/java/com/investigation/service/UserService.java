package com.investigation.service;

import com.investigation.dto.request.LoginRequest;
import com.investigation.dto.request.RegisterRequest;
import com.investigation.entity.User;

public interface UserService {

    User register(RegisterRequest request);
    User login(LoginRequest request);

}