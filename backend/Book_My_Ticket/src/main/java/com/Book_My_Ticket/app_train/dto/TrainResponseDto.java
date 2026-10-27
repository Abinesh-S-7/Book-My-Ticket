package com.Book_My_Ticket.app_train.dto;

import com.Book_My_Ticket.app_train.train_entity.Train;

import java.time.LocalDateTime;
import java.util.List;

public record TrainResponseDto(
        Long id,
        String trainNumber,
        String trainName,
        String source,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        List<TrainRouteResponseDto> routes,
        List<TrainClassResponseDto> classes
) {
    public static TrainResponseDto fromEntity(Train train)
    {
        return new TrainResponseDto(
                train.getId(),
                train.getTrainNumber(),
                train.getTrainName(),
                train.getSource(),
                train.getDestination(),
                train.getDepartureTime(),
                train.getArrivalTime(),
                train.getRoutes().stream().map(TrainRouteResponseDto::fromEntity).toList(),
                train.getClasses().stream().map(TrainClassResponseDto::fromEntity).toList()
        );
    }
}
