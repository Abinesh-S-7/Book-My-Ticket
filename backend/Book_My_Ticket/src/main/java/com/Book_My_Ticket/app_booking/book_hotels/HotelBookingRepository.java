package com.Book_My_Ticket.app_booking.book_hotels;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelBookingRepository extends JpaRepository<HotelBooking,Long> {
    List<HotelBooking> findByUserId(Long userId);
}
