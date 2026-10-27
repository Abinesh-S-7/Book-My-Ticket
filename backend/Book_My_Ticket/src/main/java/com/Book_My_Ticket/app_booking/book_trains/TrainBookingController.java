package com.Book_My_Ticket.app_booking.book_trains;

import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/train-bookings")
@RequiredArgsConstructor
public class TrainBookingController {
    private final TrainBookingService trainBookingService;

    @PostMapping("/create")
    public ResponseEntity<TrainBookingResponseDto> createBooking(@Valid @RequestBody TrainBookingRequestDto dto,
                                                                 Principal principal)
    {
        String email = principal.getName();
        return new ResponseEntity<>(trainBookingService.createBooking(dto,email), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainBookingResponseDto>> getUserTrainBookings(@PathVariable Long userId)
    {
        return new ResponseEntity<>(trainBookingService.getUserTrainBooking(userId),HttpStatus.OK);
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<TrainBookingResponseDto> cancelBooking(@PathVariable Long bookingId, Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(trainBookingService.cancelBooking(bookingId, email), HttpStatus.OK);
    }
}
