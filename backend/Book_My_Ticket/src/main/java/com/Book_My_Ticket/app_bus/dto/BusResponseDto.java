package com.Book_My_Ticket.app_bus.dto;

import com.Book_My_Ticket.app_bus.bus_entity.Bus;

import java.time.LocalDateTime;
import java.util.List;

public record BusResponseDto(
        Long id,
        String busNumber,
        String operatorName,
        String busType,
        String source,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        Integer totalSeats,
        Integer availableSeats,
        Double price,
        List<RoutePointDto> boardingPoints,
        List<RoutePointDto> droppingPoints
) {

    public static BusResponseDto fromEntity(Bus bus)
    {
        return new BusResponseDto(
                bus.getId(),
                bus.getBusNumber(),
                bus.getOperatorName(),
                bus.getBusType(),
                bus.getSource(),
                bus.getDestination(),
                bus.getDepartureTime(),
                bus.getArrivalTime(),
                bus.getTotalSeats(),
                bus.getAvailableSeats(),
                bus.getPrice(),
                bus.getBoardingPoints().stream().map(p-> new RoutePointDto(p.getLocation(),p.getTime())).toList(),
                bus.getDroppingPoints().stream().map(p-> new RoutePointDto(p.getLocation(),p.getTime())).toList()
        );
    }
}
