package com.Book_My_Ticket.app_booking.dto.TrainBookings;

import com.Book_My_Ticket.app_booking.book_trains.TrainBooking;
import com.Book_My_Ticket.enums.BookingStatus;

import java.time.LocalDateTime;

public record TrainBookingResponseDto(
        Long id,
        String trainNumber,
        String trainName,
        String className,
        String source,
        String destination,
        Integer numberOfSeatsBooked,
        Double totalAmountPaid,
        BookingStatus status,
        LocalDateTime bookingDate,
        String userEmail
) {
    public static TrainBookingResponseDto fromEntity(TrainBooking booking)
    {
        return new TrainBookingResponseDto(
                booking.getId(),
                booking.getTrainClass().getTrain().getTrainNumber(),
                booking.getTrainClass().getTrain().getTrainName(),
                booking.getTrainClass().getClassName(),
                booking.getTrainClass().getTrain().getSource(),
                booking.getTrainClass().getTrain().getDestination(),
                booking.getNumberOfSeats(),
                booking.getAmount(),
                booking.getStatus(),
                booking.getBookingDate(),
                booking.getUser().getEmail()
        );
    }
}
