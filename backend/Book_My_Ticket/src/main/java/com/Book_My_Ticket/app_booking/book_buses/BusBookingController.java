package com.Book_My_Ticket.app_booking.book_buses;

import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bus-bookings")
@RequiredArgsConstructor
public class BusBookingController {

    private final BusBookingService busBookingService;

    @PostMapping("/create")
    public ResponseEntity<BusBookingResponseDto> createBooking(@Valid @RequestBody BusBookingRequestDto dto,
                                                               Principal principal)
    {
        String email = principal.getName();
        return new ResponseEntity<>(busBookingService.createBooking(dto,email), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BusBookingResponseDto>> getUserByBusBookings(@PathVariable Long userId)
    {
        return new ResponseEntity<>(busBookingService.getUserBusBookings(userId),HttpStatus.OK);
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<BusBookingResponseDto> cancelBooking(@PathVariable Long bookingId, Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(busBookingService.cancelBooking(bookingId, email), HttpStatus.OK);
    }
}
