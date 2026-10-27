package com.Book_My_Ticket.app_bus.bus_entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoutePoint {
    String location;
    LocalDateTime time;
}
