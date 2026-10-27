package com.Book_My_Ticket.app_train.dto;

import com.Book_My_Ticket.app_train.train_entity.TrainClass;

public record TrainClassResponseDto(
        Long id,
        String className,
        Integer totalSeats,
        Integer availableSeats,
        Double price
){
    public static TrainClassResponseDto fromEntity(TrainClass classes)
    {
        return new TrainClassResponseDto(
                classes.getId(),
                classes.getClassName(),
                classes.getTotalSeats(),
                classes.getAvailableSeats(),
                classes.getPrice()
        );
    }
}
