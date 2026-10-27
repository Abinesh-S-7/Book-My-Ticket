package com.Book_My_Ticket.app_hotel.hotel_repository;

import com.Book_My_Ticket.app_hotel.hotel_entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel,Long> {
    List<Hotel> findByCityIgnoreCase(String city);
}
