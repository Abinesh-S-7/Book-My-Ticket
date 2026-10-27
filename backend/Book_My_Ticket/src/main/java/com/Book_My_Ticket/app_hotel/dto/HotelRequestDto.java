package com.Book_My_Ticket.app_hotel.dto;

import java.util.List;

public record HotelRequestDto(
        String name,
        String city,
        String address,
        Integer starRating,
        String description,
        List<RoomRequestDto> rooms
) {
}
