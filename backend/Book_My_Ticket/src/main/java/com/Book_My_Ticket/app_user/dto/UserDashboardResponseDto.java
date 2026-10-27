package com.Book_My_Ticket.app_user.dto;

import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingResponseDto;

import java.util.List;

public record UserDashboardResponseDto(
        List<FlightBookingResponseDto> flightBookings,
        List<TrainBookingResponseDto> trainBookings,
        List<BusBookingResponseDto> busBookings,
        List<HotelBookingResponseDto> hotelBookings
) {
}