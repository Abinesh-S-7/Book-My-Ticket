package com.Book_My_Ticket.app_hotel.hotel_repository;

import com.Book_My_Ticket.app_hotel.hotel_entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room,Long> {
}
