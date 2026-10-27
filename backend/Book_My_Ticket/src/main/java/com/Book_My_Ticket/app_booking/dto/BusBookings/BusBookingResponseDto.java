package com.Book_My_Ticket.app_booking.dto.BusBookings;

import com.Book_My_Ticket.app_booking.book_buses.BusBooking;
import com.Book_My_Ticket.enums.BookingStatus;

import java.time.LocalDateTime;

public record BusBookingResponseDto(
        Long id,
        String busNumber,
        String operatorName,
        String busType,
        String source,
        String destination,
        Integer numberOfSeatsBooked,
        Double totalAmountPaid,
        BookingStatus status,
        LocalDateTime bookingDate
) {
    public static BusBookingResponseDto fromEntity(BusBooking busBooking)
    {
        return new BusBookingResponseDto(
                busBooking.getId(),
                busBooking.getBus().getBusNumber(),
                busBooking.getBus().getOperatorName(),
                busBooking.getBus().getBusType(),
                busBooking.getBus().getSource(),
                busBooking.getBus().getDestination(),
                busBooking.getNumberOfSeats(),
                busBooking.getAmount(),
                busBooking.getStatus(),
                busBooking.getBookingDate()

        );
    }
}
