package com.Book_My_Ticket.app_train.train_entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trains")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Train {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Train Number is Mandatory")
    @Column(unique = true,nullable = false)
    private String trainNumber;

    @NotBlank(message = "Train Name is required")
    private String trainName;

    @NotBlank(message = "Source is Required")
    private String source;

    @NotBlank(message = "Destination is Required")
    private String destination;

    @NotNull(message = "Enter Departure Time")
    private LocalDateTime departureTime;

    @NotNull(message = "Enter Arrival Time")
    private LocalDateTime arrivalTime;

    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL,orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<TrainRoute> routes= new ArrayList<>();

    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL,orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<TrainClass> classes = new ArrayList<>();
}
