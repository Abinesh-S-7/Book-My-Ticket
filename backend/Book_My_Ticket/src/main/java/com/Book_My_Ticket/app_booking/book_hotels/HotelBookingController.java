package com.Book_My_Ticket.app_booking.book_hotels;

import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/hotel-bookings")
@RequiredArgsConstructor
public class HotelBookingController {

    private final HotelBookingService hotelBookingService;

    @PostMapping("/create")
    public ResponseEntity<HotelBookingResponseDto> createBooking(@Valid @RequestBody HotelBookingRequestDto dto,
                                                                 Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(hotelBookingService.createBooking(dto,email), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HotelBookingResponseDto>> getUserHotelBookings(@PathVariable Long userId) {
        return new ResponseEntity<>(hotelBookingService.getUserHotelBookings(userId), HttpStatus.OK);
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<HotelBookingResponseDto> cancelBooking(@PathVariable Long bookingId, Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(hotelBookingService.cancelBooking(bookingId, email), HttpStatus.OK);
    }
}