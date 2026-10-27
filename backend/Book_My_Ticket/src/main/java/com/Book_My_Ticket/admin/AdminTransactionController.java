package com.Book_My_Ticket.admin;

import com.Book_My_Ticket.app_booking.book_buses.BusBookingService;
import com.Book_My_Ticket.app_booking.book_flights.FlightBookingService;
import com.Book_My_Ticket.app_booking.book_hotels.HotelBookingService;
import com.Book_My_Ticket.app_booking.book_trains.TrainBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/transactions")
@RequiredArgsConstructor
public class AdminTransactionController {

    private final FlightBookingService flightBookingService;
    private final TrainBookingService trainBookingService;
    private final BusBookingService busBookingService;
    private final HotelBookingService hotelBookingService;

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        Map<String, Object> allBookings = new HashMap<>();
        allBookings.put("flights", flightBookingService.getAllFlightBookings());
        allBookings.put("trains", trainBookingService.getAllTrainBookings());
        allBookings.put("buses", busBookingService.getAllBusBookings());
        allBookings.put("hotels", hotelBookingService.getAllHotelBookings());

        return new ResponseEntity<>(allBookings, HttpStatus.OK);
    }
}