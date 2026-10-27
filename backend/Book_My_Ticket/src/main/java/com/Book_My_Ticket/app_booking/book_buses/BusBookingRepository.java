package com.Book_My_Ticket.app_booking.book_buses;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusBookingRepository extends JpaRepository<BusBooking,Long> {

    List<BusBooking> findByUserId(Long userId);
}
