package com.Book_My_Ticket.app_booking.dto.HotelBookings;

import com.Book_My_Ticket.enums.PaymentMethod;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record HotelBookingRequestDto(
        @NotNull
        Long roomId,
        @NotNull
        @FutureOrPresent
        LocalDate checkInDate,
        @NotNull
        @FutureOrPresent
        LocalDate checkOutDate,
        @NotNull
        Integer numberOfRooms,
        @NotNull
        PaymentMethod paymentMethod

) {
}
