package com.Book_My_Ticket.app_train.train_entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "train_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Specify Train Classes eg: 2A,Sleeper etc")
    private String className;

    @NotNull(message = "Specify Total Seats")
    private Integer totalSeats;

    private Integer availableSeats;

    @NotNull(message = "Price is required")
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Train train;

    @Version
    private Long version;
}
