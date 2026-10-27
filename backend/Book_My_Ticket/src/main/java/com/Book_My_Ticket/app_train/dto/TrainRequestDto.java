package com.Book_My_Ticket.app_train.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TrainRequestDto(
        String trainNumber,
        String trainName,
        String source,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        List<TrainRouteRequestDto> routes,
        List<TrainClassRequestDto> classes
) {
}
