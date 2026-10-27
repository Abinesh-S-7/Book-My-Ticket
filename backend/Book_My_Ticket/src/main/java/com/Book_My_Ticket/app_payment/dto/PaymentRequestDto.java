package com.Book_My_Ticket.app_payment.dto;

import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PaymentRequestDto(
        @NotNull Long userId,
        @NotNull Long bookingId,
        @NotNull BookingType bookingType,
        @NotNull @Min(1) Double amount,
        @NotNull PaymentMethod paymentMethod
) {}