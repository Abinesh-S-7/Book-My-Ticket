package com.Book_My_Ticket.app_hotel.dto;

import java.time.LocalDate;

public record RoomInventoryRequestDto(
        LocalDate date,
        Double price
) {
}
