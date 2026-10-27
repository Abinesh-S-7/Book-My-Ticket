package com.Book_My_Ticket.app_payment.payment_service;

import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_payment.payment_entity.Payment;
import com.Book_My_Ticket.app_payment.payment_repository.PaymentRepository;
import com.Book_My_Ticket.enums.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentResponseDto processPayment(PaymentRequestDto dto)
    {
        Payment payment = new Payment();
        payment.setUserId(dto.userId());
        payment.setBookingId(dto.bookingId());
        payment.setBookingType(dto.bookingType());
        payment.setAmount(dto.amount());
        payment.setPaymentMethod(dto.paymentMethod());

        boolean isSuccess = Math.random() > 0.1;

        if(isSuccess)
        {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("TXN-"+ UUID.randomUUID().toString().substring(0,8).toUpperCase());
        }else{
            payment.setStatus(PaymentStatus.FAILED);
            payment.setTransactionId(null);
        }

        Payment saved = paymentRepository.save(payment);
        return PaymentResponseDto.fromEntity(saved);
    }
}
