package com.Book_My_Ticket.app_flight.dto;

import com.Book_My_Ticket.app_flight.flight_entity.Flight;

import java.time.LocalDateTime;
import java.util.List;

public record FlightResponseDto(
        Long id,
        String flightNumber,
        String airlineName,
        String source,
        String destination,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Double price,
        Integer totalSeats,
        Integer availableSeats,
        List<FlightStopResponseDto> stops
) {
    public static FlightResponseDto fromEntity(Flight flight)
    {
        return new FlightResponseDto(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getAirlineName(),
                flight.getSource(),
                flight.getDestination(),
                flight.getArrivalTime(),
                flight.getDepartureTime(),
                flight.getPrice(),
                flight.getTotalSeats(),
                flight.getAvailableSeats(),
                flight.getIntermediateStops().stream()
                        .map(FlightStopResponseDto::fromEntity)
                        .toList()
        );
    }
}
