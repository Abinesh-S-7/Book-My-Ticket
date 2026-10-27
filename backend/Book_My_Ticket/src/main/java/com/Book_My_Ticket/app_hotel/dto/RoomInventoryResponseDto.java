package com.Book_My_Ticket.app_hotel.dto;

import com.Book_My_Ticket.app_hotel.hotel_entity.RoomInventory;

import java.time.LocalDate;

public record RoomInventoryResponseDto(
        LocalDate date,
        Integer availableRooms,
        Double price
) {
    public static RoomInventoryResponseDto fromEntity(RoomInventory roomInventory)
    {
        return new RoomInventoryResponseDto(
                roomInventory.getDate(),
                roomInventory.getAvailableRooms(),
                roomInventory.getPrice()
        );
    }
}
