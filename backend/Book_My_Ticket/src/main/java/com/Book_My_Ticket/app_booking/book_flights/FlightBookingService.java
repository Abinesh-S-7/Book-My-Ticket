package com.Book_My_Ticket.app_booking.book_flights;

import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.FlightBookings.FlightBookingResponseDto;
import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_flight.flight_entity.Flight;
import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.enums.BookingStatus;
import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentStatus;
import com.Book_My_Ticket.app_flight.flight_repository.FlightRepository;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import com.Book_My_Ticket.app_payment.payment_service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightBookingService {
    private final FlightBookingRepository flightBookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final PaymentService paymentService;

    @Transactional
    public FlightBookingResponseDto createBooking(FlightBookingRequestDto dto,String userEmail)
    {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(()->new RuntimeException("User Not Found"));
        Flight flight = flightRepository.findById(dto.flightId())
                .orElseThrow(()-> new RuntimeException("Flight Not Found"));

        if (flight.getAvailableSeats() < dto.numberOfSeats())
        {
            throw new RuntimeException("Not Enough Available Seats");
        }

        flight.setAvailableSeats(flight.getAvailableSeats()-dto.numberOfSeats());

        Double total = dto.numberOfSeats() * flight.getPrice();

        FlightBooking newFlightBooking = new FlightBooking();

        newFlightBooking.setUser(user);
        newFlightBooking.setFlight(flight);
        newFlightBooking.setNumberOfSeats(dto.numberOfSeats());
        newFlightBooking.setTotalAmount(total);
        newFlightBooking.setStatus(BookingStatus.PENDING);

        FlightBooking savedFlightBooking = flightBookingRepository.save(newFlightBooking);

        PaymentRequestDto paymentRequest = new PaymentRequestDto(
                user.getId(),
                savedFlightBooking.getId(),
                BookingType.FLIGHT,
                total,
                dto.paymentMethod()
        );

        PaymentResponseDto paymentResponse = paymentService.processPayment(paymentRequest);

        if (paymentResponse.status() == PaymentStatus.SUCCESS) {
            savedFlightBooking.setStatus(BookingStatus.CONFIRMED);
        } else {
            throw new RuntimeException("Flight Payment Failed. Transaction rolled back.");
        }

        return FlightBookingResponseDto.fromEntity(savedFlightBooking);
    }

    public List<FlightBookingResponseDto> getUserBooking(Long userId)
    {
        List<FlightBooking> flightBookings = flightBookingRepository.findByUserId(userId);
        return flightBookings.stream().map(FlightBookingResponseDto::fromEntity).toList();
    }

    @Transactional
    public FlightBookingResponseDto cancelBooking(Long bookingId, String email) {
        FlightBooking booking = flightBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Flight flight = booking.getFlight();
        flight.setAvailableSeats(flight.getAvailableSeats() + booking.getNumberOfSeats());

        return FlightBookingResponseDto.fromEntity(flightBookingRepository.save(booking));
    }

    public List<FlightBookingResponseDto> getAllFlightBookings() {
        return flightBookingRepository.findAll().stream()
                .map(FlightBookingResponseDto::fromEntity).toList();
    }
}
