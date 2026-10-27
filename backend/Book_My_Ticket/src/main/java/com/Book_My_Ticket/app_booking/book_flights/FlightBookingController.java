package com.Book_My_Ticket.app_booking.book_flights;

import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/flight-bookings")
@RequiredArgsConstructor
public class FlightBookingController {
    private final FlightBookingService flightBookingService;

    @PostMapping("/create")
    public ResponseEntity<FlightBookingResponseDto> createBooking(@Valid @RequestBody FlightBookingRequestDto dto,
                                                                  Principal principal)
    {
        String email = principal.getName();
        return new ResponseEntity<>(flightBookingService.createBooking(dto,email), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FlightBookingResponseDto>> getUserBookings(@PathVariable Long userId)
    {
        return new ResponseEntity<>(flightBookingService.getUserBooking(userId),HttpStatus.OK);
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<FlightBookingResponseDto> cancelBooking(@PathVariable Long bookingId, Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(flightBookingService.cancelBooking(bookingId, email), HttpStatus.OK);
    }
}
