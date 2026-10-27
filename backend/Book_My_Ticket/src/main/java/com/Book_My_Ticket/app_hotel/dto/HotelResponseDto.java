package com.Book_My_Ticket.app_hotel.dto;

import com.Book_My_Ticket.app_hotel.hotel_entity.Hotel;

import java.util.List;

public record HotelResponseDto(
        Long id,
        String name,
        String city,
        String address,
        Integer starRating,
        String description,
        List<RoomResponseDto> rooms
) {
    public static HotelResponseDto fromEntity(Hotel hotel)
    {
        return new HotelResponseDto(
                hotel.getId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getAddress(),
                hotel.getStarRating(),
                hotel.getDescription(),
                hotel.getRooms().stream().map(RoomResponseDto::fromEntity).toList()
        );
    }
}
