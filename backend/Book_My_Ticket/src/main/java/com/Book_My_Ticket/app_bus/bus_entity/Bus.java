package com.Book_My_Ticket.app_bus.bus_entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bus Number is Mandatory")
    @Column(nullable = false,unique = true)
    private String busNumber;

    @NotBlank(message = "Operator Name is Required")
    private String operatorName;

    @NotBlank(message = "Bus Type is Mandatory")
    private String busType;

    @NotBlank(message = "Specify Source")
    private String source;

    @NotBlank(message = "Specify Destination")
    private String destination;

    @NotNull(message = "Specify Departure Time")
    private LocalDateTime departureTime;

    @NotNull(message = "Specify Arrival Time")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Specify Total Seats")
    private Integer totalSeats;

    private Integer availableSeats;

    @NotNull(message = "Specify Price for Individual Seats")
    private Double price;

    @ElementCollection
    @CollectionTable(name = "bus_boarding_points")
    private List<RoutePoint> boardingPoints;

    @ElementCollection
    @CollectionTable(name = "bus_dropping_points")
    private List<RoutePoint> droppingPoints;

    @Version
    private Long version;
}
