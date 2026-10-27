package com.Book_My_Ticket.app_flight.dto;

import com.Book_My_Ticket.app_flight.flight_entity.FlightStop;

import java.time.LocalDateTime;

public record FlightStopResponseDto(
        Long id,
        String city,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Integer stopOrder
) {
    public static FlightStopResponseDto fromEntity(FlightStop stop)
    {
        return new FlightStopResponseDto(stop.getId(),
                stop.getCity(),
                stop.getArrivalTime(),
                stop.getDepartureTime(),
                stop.getStopOrder()
        );
    }
}
