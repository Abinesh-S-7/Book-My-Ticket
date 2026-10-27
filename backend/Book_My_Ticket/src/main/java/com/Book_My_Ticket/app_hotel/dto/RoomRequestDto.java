package com.Book_My_Ticket.app_hotel.dto;

import java.util.List;

public record RoomRequestDto(
        String roomType,
        Integer maxOccupancy,
        Integer totalRooms,
        List<RoomInventoryRequestDto> inventories
) {
}
