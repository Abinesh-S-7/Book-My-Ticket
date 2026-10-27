package com.Book_My_Ticket.app_booking.book_hotels;

import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.HotelBookings.HotelBookingResponseDto;
import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_hotel.hotel_entity.Room;
import com.Book_My_Ticket.app_hotel.hotel_entity.RoomInventory;
import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.enums.BookingStatus;
import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentStatus;
import com.Book_My_Ticket.app_hotel.hotel_repository.RoomInventoryRepository;
import com.Book_My_Ticket.app_hotel.hotel_repository.RoomRepository;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import com.Book_My_Ticket.app_payment.payment_service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelBookingService {

    private final HotelBookingRepository hotelBookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RoomInventoryRepository roomInventoryRepository;
    private final PaymentService paymentService;

    @Transactional
    public HotelBookingResponseDto createBooking(HotelBookingRequestDto dto,String email) {
        if (!dto.checkOutDate().isAfter(dto.checkInDate())) {
            throw new RuntimeException("Check-out date must be strictly after check-in date");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Room room = roomRepository.findById(dto.roomId())
                .orElseThrow(() -> new RuntimeException("Room Not Found"));

        long expectedNights = ChronoUnit.DAYS.between(dto.checkInDate(), dto.checkOutDate());

        List<RoomInventory> inventories = roomInventoryRepository.findByRoomIdAndDateBetween(
                room.getId(),
                dto.checkInDate(),
                dto.checkOutDate().minusDays(1)
        );

        if (inventories.size() < expectedNights) {
            throw new RuntimeException("Inventory not initialized for all selected dates");
        }

        double totalAmount = 0.0;

        for (RoomInventory inventory : inventories) {
            if (inventory.getAvailableRooms() < dto.numberOfRooms()) {
                throw new RuntimeException("Not enough rooms available on " + inventory.getDate());
            }

            inventory.setAvailableRooms(inventory.getAvailableRooms() - dto.numberOfRooms());
            totalAmount += (inventory.getPrice() * dto.numberOfRooms());
        }

        HotelBooking booking = new HotelBooking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(dto.checkInDate());
        booking.setCheckOutDate(dto.checkOutDate());
        booking.setNumberOfRooms(dto.numberOfRooms());
        booking.setAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);

        HotelBooking savedBooking = hotelBookingRepository.save(booking);

        PaymentRequestDto paymentRequest = new PaymentRequestDto(
                user.getId(),
                savedBooking.getId(),
                BookingType.HOTEL,
                totalAmount,
                dto.paymentMethod()
        );

        PaymentResponseDto paymentResponse = paymentService.processPayment(paymentRequest);

        if (paymentResponse.status() == PaymentStatus.SUCCESS) {
            savedBooking.setStatus(BookingStatus.CONFIRMED);
        } else {
            throw new RuntimeException("Payment Failed. Transaction rolled back.");
        }

        return HotelBookingResponseDto.fromEntity(savedBooking);
    }

    public List<HotelBookingResponseDto> getUserHotelBookings(Long userId) {
        List<HotelBooking> bookings = hotelBookingRepository.findByUserId(userId);
        return bookings.stream().map(HotelBookingResponseDto::fromEntity).toList();
    }

    @Transactional
    public HotelBookingResponseDto cancelBooking(Long bookingId, String email) {
        HotelBooking booking = hotelBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Room room = booking.getRoom();
        LocalDate currentDate = booking.getCheckInDate();
        while (currentDate.isBefore(booking.getCheckOutDate())) {
            final LocalDate dateToUpdate = currentDate;
            RoomInventory inventory = room.getInventories().stream()
                    .filter(inv -> inv.getDate().equals(dateToUpdate))
                    .findFirst()
                    .orElse(null);

            if (inventory != null) {
                inventory.setAvailableRooms(inventory.getAvailableRooms() + booking.getNumberOfRooms());
            }
            currentDate = currentDate.plusDays(1);
        }

        return HotelBookingResponseDto.fromEntity(hotelBookingRepository.save(booking));
    }
    public List<HotelBookingResponseDto> getAllHotelBookings() {
        return hotelBookingRepository.findAll().stream()
                .map(HotelBookingResponseDto::fromEntity).toList();
    }
}