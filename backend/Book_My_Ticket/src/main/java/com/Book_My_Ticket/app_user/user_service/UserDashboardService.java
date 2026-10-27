package com.Book_My_Ticket.app_user.user_service;

import com.Book_My_Ticket.app_booking.book_buses.BusBookingRepository;
import com.Book_My_Ticket.app_booking.book_flights.FlightBookingRepository;
import com.Book_My_Ticket.app_booking.book_hotels.HotelBookingRepository;
import com.Book_My_Ticket.app_booking.book_trains.TrainBookingRepository;
import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingResponseDto;
import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingResponseDto;
import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.app_user.dto.UserDashboardResponseDto;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDashboardService {

    private final FlightBookingRepository flightBookingRepository;
    private final TrainBookingRepository trainBookingRepository;
    private final BusBookingRepository busBookingRepository;
    private final HotelBookingRepository hotelBookingRepository;
    private final UserRepository userRepository;

    public UserDashboardResponseDto getUserDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User Not Found"));

        Long userId = user.getId();

        return new UserDashboardResponseDto(
                flightBookingRepository.findByUserId(userId).stream()
                        .map(FlightBookingResponseDto::fromEntity).toList(),

                trainBookingRepository.findByUserId(userId).stream()
                        .map(TrainBookingResponseDto::fromEntity).toList(),

                busBookingRepository.findByUserId(userId).stream()
                        .map(BusBookingResponseDto::fromEntity).toList(),

                hotelBookingRepository.findByUserId(userId).stream()
                        .map(HotelBookingResponseDto::fromEntity).toList()
        );
    }
}