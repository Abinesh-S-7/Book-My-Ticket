package com.Book_My_Ticket.app_payment.payment_controller;

import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_payment.payment_service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody PaymentRequestDto dto)
    {
        return new ResponseEntity<>(paymentService.processPayment(dto), HttpStatus.OK);
    }
}
