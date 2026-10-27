package com.Book_My_Ticket.app_flight.flight_entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "flights")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Flight Number is Required")
    @Column(nullable = false, unique = true)
    private String flightNumber;

    @NotBlank(message = "Airline Name is Required")
    private String airlineName;

    @NotBlank(message = "Source must be specified")
    private String source;

    @NotBlank(message = "Destination must be specified")
    private String destination;

    @NotNull(message = "Arrival Time must be specified")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Departure Time must be specified")
    private LocalDateTime departureTime;

    @NotNull(message = "Price must be specified")
    private Double price;

    @NotNull(message = "Mention Total Seat Capacity")
    private Integer totalSeats;

    @NotNull(message = "Mention Number of Available Seats")
    private Integer availableSeats;

    @Version
    private Long version;

    @OneToMany(mappedBy = "flight",cascade = CascadeType.ALL,orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<FlightStop> intermediateStops = new ArrayList<>();
}
