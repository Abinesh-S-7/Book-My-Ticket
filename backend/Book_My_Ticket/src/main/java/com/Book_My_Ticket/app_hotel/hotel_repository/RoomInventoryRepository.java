package com.Book_My_Ticket.app_hotel.hotel_repository;

import com.Book_My_Ticket.app_hotel.hotel_entity.RoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RoomInventoryRepository extends JpaRepository<RoomInventory,Long> {
    List<RoomInventory> findByRoomIdAndDateBetween(Long roomId, LocalDate startDate, LocalDate endDate);
}
