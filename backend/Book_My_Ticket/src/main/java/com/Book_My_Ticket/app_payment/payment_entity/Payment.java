package com.Book_My_Ticket.app_payment.payment_entity;

import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentMethod;
import com.Book_My_Ticket.enums.PaymentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long userId;

    @NotNull
    private Long bookingId;

    @Enumerated(EnumType.STRING)
    private BookingType bookingType;

    @NotNull
    private Double amount;

    @Enumerated(EnumType.STRING)
    @NotNull
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @NotNull
    private PaymentStatus status;

    private String transactionId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime paymentDate;

}
