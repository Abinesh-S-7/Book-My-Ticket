package com.Book_My_Ticket.app_bus.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BusRequestDto(
        String busNumber,
        String operatorName,
        String busType,
        String source,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        Integer totalSeats,
        Double price,
        List<RoutePointDto> boardingPoints,
        List<RoutePointDto> droppingPoints
) {
}
