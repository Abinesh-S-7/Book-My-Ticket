package com.Book_My_Ticket.app_bus.bus_service;

import com.Book_My_Ticket.app_bus.bus_entity.Bus;
import com.Book_My_Ticket.app_bus.bus_entity.RoutePoint;
import com.Book_My_Ticket.app_bus.bus_repository.BusRepository;
import com.Book_My_Ticket.app_bus.dto.BusRequestDto;
import com.Book_My_Ticket.app_bus.dto.BusResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;

    public BusResponseDto addBus(BusRequestDto dto)
    {
        Bus bus = new Bus();

        bus.setBusNumber(dto.busNumber());
        bus.setOperatorName(dto.operatorName());
        bus.setBusType(dto.busType());
        bus.setSource(dto.source());
        bus.setDestination(dto.destination());
        bus.setArrivalTime(dto.arrivalTime());
        bus.setDepartureTime(dto.departureTime());
        bus.setTotalSeats(dto.totalSeats());
        bus.setAvailableSeats(dto.totalSeats());
        bus.setPrice(dto.price());

        if (dto.boardingPoints() != null) {
            List<RoutePoint> boardingPoints = dto.boardingPoints().stream()
                    .map(p -> new RoutePoint(p.location(), p.time()))
                    .toList();
            bus.setBoardingPoints(boardingPoints);
        }

        if (dto.droppingPoints() != null) {
            List<RoutePoint> droppingPoints = dto.droppingPoints().stream()
                    .map(p -> new RoutePoint(p.location(), p.time()))
                    .toList();
            bus.setDroppingPoints(droppingPoints);
        }

        Bus savedBus = busRepository.save(bus);
        return BusResponseDto.fromEntity(savedBus);
    }

    public List<BusResponseDto> searchBuses(String source, String destination, LocalDate travelDate) {
        LocalDateTime startOfDay = travelDate.atStartOfDay();
        LocalDateTime endOfDay = travelDate.atTime(23, 59, 59);

        List<Bus> buses = busRepository.findBySourceAndDestinationAndDepartureTimeBetween(
                source, destination, startOfDay, endOfDay
        );

        return buses.stream().map(BusResponseDto::fromEntity).toList();
    }

    public List<BusResponseDto> getAllBuses() {
        return busRepository.findAll()
                .stream()
                .map(BusResponseDto::fromEntity)
                .toList();
    }

    public void deleteBus(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));
        busRepository.delete(bus);
    }
}
