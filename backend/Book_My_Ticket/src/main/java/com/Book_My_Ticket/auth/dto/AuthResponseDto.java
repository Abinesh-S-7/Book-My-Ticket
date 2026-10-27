package com.Book_My_Ticket.auth.dto;

import com.Book_My_Ticket.enums.Role;

public record AuthResponseDto(
        String token,
        Role role
) {
}