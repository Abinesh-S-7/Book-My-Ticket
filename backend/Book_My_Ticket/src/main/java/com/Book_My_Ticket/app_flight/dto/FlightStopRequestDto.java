package com.Book_My_Ticket.app_flight.dto;

import java.time.LocalDateTime;

public record FlightStopRequestDto (
        String city,
        LocalDateTime arrivalTime,
        LocalDateTime departureTime,
        Integer stopOrder
){
}
