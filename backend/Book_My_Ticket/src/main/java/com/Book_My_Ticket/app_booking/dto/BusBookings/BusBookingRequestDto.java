package com.Book_My_Ticket.app_booking.dto.BusBookings;

import com.Book_My_Ticket.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BusBookingRequestDto(
        @NotNull
        Long busId,
        @NotNull
        @Min(1)
        Integer numberOfSeats,
        @NotNull
        PaymentMethod paymentMethod
) {
}
