package com.Book_My_Ticket.app_booking.dto.HotelBookings;

import com.Book_My_Ticket.app_booking.book_hotels.HotelBooking;
import com.Book_My_Ticket.enums.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record HotelBookingResponseDto(
        Long id,
        String hotelName,
        String roomType,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        Integer numberOfRooms,
        Double totalAmount,
        BookingStatus status,
        LocalDateTime bookingDate
) {
    public static HotelBookingResponseDto fromEntity(HotelBooking booking)
    {
        return new HotelBookingResponseDto(
                booking.getId(),
                booking.getRoom().getHotel().getName(),
                booking.getRoom().getRoomType(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumberOfRooms(),
                booking.getAmount(),
                booking.getStatus(),
                booking.getBookingDate()

        );
    }
}
