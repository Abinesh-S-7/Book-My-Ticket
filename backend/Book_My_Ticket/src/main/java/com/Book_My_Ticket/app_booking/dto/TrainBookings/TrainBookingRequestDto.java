package com.Book_My_Ticket.app_booking.dto.TrainBookings;

import com.Book_My_Ticket.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TrainBookingRequestDto(
        @NotNull
        Long trainClassId,
        @NotNull
        @Min(1)
        Integer numberOfSeats,

        @NotNull
        PaymentMethod paymentMethod
) {
}
