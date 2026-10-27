package com.Book_My_Ticket.app_train.train_entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "train_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Station Name is Required")
    private String stationName;

    @NotNull(message = "Departure Time is Required")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is Required")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Specify Stop Order")
    private Integer stopOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id",nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Train train;
}
