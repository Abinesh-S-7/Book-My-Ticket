package com.Book_My_Ticket.app_train.dto;

import com.Book_My_Ticket.app_train.train_entity.TrainRoute;

import java.time.LocalDateTime;

public record TrainRouteResponseDto(
        String stationName,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Integer stopOrder
) {
    public static TrainRouteResponseDto fromEntity(TrainRoute route)
    {
        return new TrainRouteResponseDto(
                route.getStationName(),
                route.getArrivalTime(),
                route.getDepartureTime(),
                route.getStopOrder()
        );
    }
}
