package com.Book_My_Ticket.admin;

import com.Book_My_Ticket.app_booking.book_buses.BusBookingRepository;
import com.Book_My_Ticket.app_booking.book_flights.FlightBookingRepository;
import com.Book_My_Ticket.app_booking.book_hotels.HotelBookingRepository;
import com.Book_My_Ticket.app_booking.book_trains.TrainBookingRepository;
import com.Book_My_Ticket.app_bus.bus_repository.BusRepository;
import com.Book_My_Ticket.app_flight.flight_repository.FlightRepository;
import com.Book_My_Ticket.app_hotel.hotel_repository.HotelRepository;
import com.Book_My_Ticket.app_train.train_repository.TrainRepository;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final TrainRepository trainRepository;
    private final BusRepository busRepository;
    private final HotelRepository hotelRepository;

    private final FlightBookingRepository flightBookingRepository;
    private final TrainBookingRepository trainBookingRepository;
    private final BusBookingRepository busBookingRepository;
    private final HotelBookingRepository hotelBookingRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        Map<String, Long> inventoryCounts = new HashMap<>();
        inventoryCounts.put("flights", flightRepository.count());
        inventoryCounts.put("trains", trainRepository.count());
        inventoryCounts.put("buses", busRepository.count());
        inventoryCounts.put("hotels", hotelRepository.count());
        stats.put("inventoryCounts", inventoryCounts);

        Map<String, Long> bookingCounts = new HashMap<>();
        bookingCounts.put("flights", flightBookingRepository.count());
        bookingCounts.put("trains", trainBookingRepository.count());
        bookingCounts.put("buses", busBookingRepository.count());
        bookingCounts.put("hotels", hotelBookingRepository.count());
        stats.put("bookingCounts", bookingCounts);

        double flightRev = flightBookingRepository.findAll().stream().mapToDouble(b -> b.getTotalAmount() != null ? b.getTotalAmount() : 0.0).sum();
        double trainRev = trainBookingRepository.findAll().stream().mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0).sum();
        double busRev = busBookingRepository.findAll().stream().mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0).sum();
        double hotelRev = hotelBookingRepository.findAll().stream().mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0).sum();

        Map<String, Double> revenueCounts = new HashMap<>();
        revenueCounts.put("flights", flightRev);
        revenueCounts.put("trains", trainRev);
        revenueCounts.put("buses", busRev);
        revenueCounts.put("hotels", hotelRev);
        stats.put("revenueCounts", revenueCounts);

        long totalUsers = userRepository.count();
        long totalBookings = bookingCounts.values().stream().mapToLong(Long::longValue).sum();
        double totalRevenue = flightRev + trainRev + busRev + hotelRev;

        stats.put("totalUsers", totalUsers);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}