package com.Book_My_Ticket.app_flight.flight_entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flight_stops")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id",nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Flight flight;

    private String city;

    private LocalDateTime arrivalTime;

    private LocalDateTime departureTime;

    private Integer stopOrder;
}
