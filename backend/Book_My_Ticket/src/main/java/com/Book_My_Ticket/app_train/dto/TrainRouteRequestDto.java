package com.Book_My_Ticket.app_train.dto;

import java.time.LocalDateTime;

public record TrainRouteRequestDto(
        String stationName,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Integer stopOrder
){
}
