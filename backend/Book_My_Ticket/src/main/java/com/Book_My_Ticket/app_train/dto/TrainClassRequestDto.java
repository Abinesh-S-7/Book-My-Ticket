package com.Book_My_Ticket.app_train.dto;

public record TrainClassRequestDto(
        String className,
        Integer totalSeats,
        Double price
) {
}
