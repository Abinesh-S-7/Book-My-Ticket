package com.Book_My_Ticket.app_user.user_controller;

import com.Book_My_Ticket.app_user.dto.UserRegistrationDto;
import com.Book_My_Ticket.app_user.dto.UserResponseDto;
import com.Book_My_Ticket.app_user.user_service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody UserRegistrationDto dto)
    {
        return new ResponseEntity<>(userService.registerUser(dto),HttpStatus.CREATED);
    }
}
