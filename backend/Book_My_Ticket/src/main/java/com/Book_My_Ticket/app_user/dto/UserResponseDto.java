package com.Book_My_Ticket.app_user.dto;

import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.enums.Role;

import java.time.LocalDateTime;

public record UserResponseDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        Role role,
        LocalDateTime createdAt
) {

    public static UserResponseDto fromEntity(User user)
    {
        return new UserResponseDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
