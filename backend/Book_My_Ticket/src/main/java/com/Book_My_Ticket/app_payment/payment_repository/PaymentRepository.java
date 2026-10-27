package com.Book_My_Ticket.app_payment.payment_repository;

import com.Book_My_Ticket.app_payment.payment_entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
