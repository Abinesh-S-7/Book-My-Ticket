package com.Book_My_Ticket.app_booking.book_trains;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainBookingRepository extends JpaRepository<TrainBooking,Long> {
    List<TrainBooking> findByUserId(Long userId);
}
