package com.Book_My_Ticket.app_bus.dto;

import java.time.LocalDateTime;

public record RoutePointDto(
        String location,
        LocalDateTime time
) {
}
