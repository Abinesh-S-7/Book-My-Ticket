package com.Book_My_Ticket.app_hotel.dto;

import com.Book_My_Ticket.app_hotel.hotel_entity.Room;

import java.util.List;

public record RoomResponseDto(
        Long id,
        String roomType,
        Integer maxOccupancy,
        Integer totalRooms,
        List<RoomInventoryResponseDto> inventories
) {

    public static RoomResponseDto fromEntity(Room room)
    {
        return new RoomResponseDto(
                room.getId(),
                room.getRoomType(),
                room.getMaxOccupancy(),
                room.getTotalRooms(),
                room.getInventories().stream().map(RoomInventoryResponseDto::fromEntity).toList()
        );
    }
}
