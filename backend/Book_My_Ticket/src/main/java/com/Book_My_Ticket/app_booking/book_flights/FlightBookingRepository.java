package com.Book_My_Ticket.app_booking.book_flights;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightBookingRepository extends JpaRepository<FlightBooking,Long> {
    List<FlightBooking> findByUserId(Long userId);
}
