package com.Book_My_Ticket.app_booking.book_buses;

import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.BusBookings.BusBookingResponseDto;
import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_bus.bus_entity.Bus;
import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.enums.BookingStatus;
import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentStatus;
import com.Book_My_Ticket.app_bus.bus_repository.BusRepository;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import com.Book_My_Ticket.app_payment.payment_service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusBookingService {
    private final BusBookingRepository busBookingRepository;
    private final UserRepository userRepository;
    private final BusRepository busRepository;
    private final PaymentService paymentService;

    @Transactional
    public BusBookingResponseDto createBooking(BusBookingRequestDto dto,String userEmail)
    {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(()-> new RuntimeException("User Not Found"));

        Bus bus = busRepository.findById(dto.busId())
                .orElseThrow(()-> new RuntimeException("Bus Not Found"));

        if(bus.getAvailableSeats() < dto.numberOfSeats())
        {
            throw new RuntimeException("Not Enough Available Seats");
        }

        bus.setAvailableSeats(bus.getAvailableSeats()- dto.numberOfSeats());

        Double total = dto.numberOfSeats() * bus.getPrice();

        BusBooking busBooking = new BusBooking();

        busBooking.setUser(user);
        busBooking.setBus(bus);
        busBooking.setNumberOfSeats(dto.numberOfSeats());
        busBooking.setAmount(total);
        busBooking.setStatus(BookingStatus.PENDING);

        BusBooking booked = busBookingRepository.save(busBooking);

        PaymentRequestDto paymentRequest = new PaymentRequestDto(
                user.getId(),
                booked.getId(),
                BookingType.BUS,
                total,
                dto.paymentMethod()
        );

        PaymentResponseDto paymentResponse = paymentService.processPayment(paymentRequest);

        if (paymentResponse.status() == PaymentStatus.SUCCESS) {
            booked.setStatus(BookingStatus.CONFIRMED);
        } else {
            throw new RuntimeException("Bus Payment Failed. Transaction rolled back.");
        }

        return BusBookingResponseDto.fromEntity(booked);
    }

    public List<BusBookingResponseDto> getUserBusBookings(Long userId)
    {
        List<BusBooking> busBookings = busBookingRepository.findByUserId(userId);
        return busBookings.stream().map(BusBookingResponseDto::fromEntity).toList();
    }

    @Transactional
    public BusBookingResponseDto cancelBooking(Long bookingId, String email) {
        BusBooking booking = busBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Bus bus = booking.getBus();
        bus.setAvailableSeats(bus.getAvailableSeats() + booking.getNumberOfSeats());

        return BusBookingResponseDto.fromEntity(busBookingRepository.save(booking));
    }

    public List<BusBookingResponseDto> getAllBusBookings() {
        return busBookingRepository.findAll().stream()
                .map(BusBookingResponseDto::fromEntity).toList();
    }
}
