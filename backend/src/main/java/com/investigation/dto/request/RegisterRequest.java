package com.investigation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String role; // validated + converted to Role enum in the service layer

}
