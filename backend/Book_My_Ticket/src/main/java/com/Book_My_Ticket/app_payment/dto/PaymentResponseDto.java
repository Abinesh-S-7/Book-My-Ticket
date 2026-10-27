package com.Book_My_Ticket.app_payment.dto;

import com.Book_My_Ticket.app_payment.payment_entity.Payment;
import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentMethod;
import com.Book_My_Ticket.enums.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponseDto(
        Long id,
        Long bookingId,
        BookingType bookingType,
        Double amount,
        PaymentMethod paymentMethod,
        PaymentStatus status,
        String transactionId,
        LocalDateTime paymentDate
) {
    public static PaymentResponseDto fromEntity(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getBookingId(),
                payment.getBookingType(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getPaymentDate()
        );
    }
}