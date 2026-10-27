package com.Book_My_Ticket.app_booking.book_trains;

import com.Book_My_Ticket.app_payment.dto.PaymentRequestDto;
import com.Book_My_Ticket.app_payment.dto.PaymentResponseDto;
import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingRequestDto;
import com.Book_My_Ticket.app_booking.dto.TrainBookings.TrainBookingResponseDto;
import com.Book_My_Ticket.app_payment.payment_service.PaymentService;
import com.Book_My_Ticket.app_train.train_entity.TrainClass;
import com.Book_My_Ticket.app_user.user_entity.User;
import com.Book_My_Ticket.enums.BookingStatus;
import com.Book_My_Ticket.enums.BookingType;
import com.Book_My_Ticket.enums.PaymentStatus;

import com.Book_My_Ticket.app_train.train_repository.TrainClassRepository;
import com.Book_My_Ticket.app_user.user_repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainBookingService {

    private final UserRepository userRepository;
    private final TrainBookingRepository trainBookingRepository;
    private final TrainClassRepository trainClassRepository;
    private final PaymentService paymentService;

    @Transactional
    public TrainBookingResponseDto createBooking(TrainBookingRequestDto dto,String email)
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User Not Found"));
        TrainClass trainClass = trainClassRepository.findById(dto.trainClassId())
                .orElseThrow(()-> new RuntimeException("Train Class Not Found"));

        if(trainClass.getAvailableSeats() < dto.numberOfSeats())
        {
            throw new RuntimeException("Not Enough Seats Available");
        }
        trainClass.setAvailableSeats(trainClass.getAvailableSeats()-dto.numberOfSeats());

        Double total = trainClass.getPrice() * dto.numberOfSeats();

        TrainBooking trainBooking = new TrainBooking();
        trainBooking.setUser(user);
        trainBooking.setTrainClass(trainClass);
        trainBooking.setNumberOfSeats(dto.numberOfSeats());
        trainBooking.setAmount(total);
        trainBooking.setStatus(BookingStatus.PENDING);

        TrainBooking booked = trainBookingRepository.save(trainBooking);

        PaymentRequestDto paymentRequest = new PaymentRequestDto(
                user.getId(),
                booked.getId(),
                BookingType.TRAIN,
                total,
                dto.paymentMethod()
        );

        PaymentResponseDto paymentResponse = paymentService.processPayment(paymentRequest);

        if (paymentResponse.status()== PaymentStatus.SUCCESS)
        {
            booked.setStatus(BookingStatus.CONFIRMED);
        }else {
            throw new RuntimeException("Train Payment Failed Transaction Rolled Back");
        }

        return TrainBookingResponseDto.fromEntity(booked);
    }

    public List<TrainBookingResponseDto> getUserTrainBooking(Long userId)
    {
        List<TrainBooking> trainBookings = trainBookingRepository.findByUserId(userId);
        return trainBookings.stream().map(TrainBookingResponseDto::fromEntity).toList();
    }

    @Transactional
    public TrainBookingResponseDto cancelBooking(Long bookingId, String email) {
        TrainBooking booking = trainBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized cancellation attempt");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        TrainClass trainClass = booking.getTrainClass();
        trainClass.setAvailableSeats(trainClass.getAvailableSeats() + booking.getNumberOfSeats());

        return TrainBookingResponseDto.fromEntity(trainBookingRepository.save(booking));
    }

    public List<TrainBookingResponseDto> getAllTrainBookings() {
        return trainBookingRepository.findAll().stream()
                .map(TrainBookingResponseDto::fromEntity).toList();
    }
}
