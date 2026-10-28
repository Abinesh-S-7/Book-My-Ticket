package com.Book_My_Ticket.app_booking.dto.FlightBookings;

import com.Book_My_Ticket.app_booking.book_flights.FlightBooking;
import com.Book_My_Ticket.enums.BookingStatus;

import java.time.LocalDateTime;

public record FlightBookingResponseDto(
        Long id,
        String flightNumber,
        String source,
        String destination,
        Integer numberOfSeatsBooked,
        Double totalAmountPaid,
        BookingStatus status,
        LocalDateTime bookingDate,
        String userEmail
) {

    public static FlightBookingResponseDto fromEntity(FlightBooking flightBooking)
    {
        return new FlightBookingResponseDto(
                flightBooking.getId(),
                flightBooking.getFlight().getFlightNumber(),
                flightBooking.getFlight().getSource(),
                flightBooking.getFlight().getDestination(),
                flightBooking.getNumberOfSeats(),
                flightBooking.getTotalAmount(),
                flightBooking.getStatus(),
                flightBooking.getBookingDate(),
                flightBooking.getUser().getEmail()
        );
    }
}
