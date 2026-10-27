package com.Book_My_Ticket.app_flight.dto;

import java.time.LocalDateTime;
import java.util.List;

public record FlightRequestDto(
        String flightNumber,
        String airlineName,
        String source,
        String destination,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Double price,
        Integer totalSeats,
        List<FlightStopRequestDto> stops
) {
}
