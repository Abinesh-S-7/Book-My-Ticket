package com.Book_My_Ticket.app_user.user_service;

import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.app_user.dto.UserRegistrationDto;
import com.Book_My_Ticket.app_user.dto.UserResponseDto;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import com.Book_My_Ticket.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDto registerUser(UserRegistrationDto dto)
    {
        if(userRepository.existsByEmail(dto.email()))
        {
            throw new RuntimeException("Email is Already Registered");
        }
        User newUser = new User();
        newUser.setFirstName(dto.firstName());
        newUser.setLastName(dto.lastName());
        newUser.setEmail(dto.email());
        newUser.setPassword(dto.password());
        newUser.setPhoneNumber(dto.phoneNumber());
        newUser.setRole(Role.CUSTOMER);

        User savedUser = userRepository.save(newUser);

        return UserResponseDto.fromEntity(savedUser);
    }
}
