package com.Book_My_Ticket.app_flight.flight_service;

import com.Book_My_Ticket.app_flight.flight_entity.Flight;
import com.Book_My_Ticket.app_flight.flight_entity.FlightStop;
import com.Book_My_Ticket.app_flight.dto.FlightRequestDto;
import com.Book_My_Ticket.app_flight.dto.FlightResponseDto;
import com.Book_My_Ticket.app_flight.dto.FlightStopRequestDto;
import com.Book_My_Ticket.app_flight.flight_repository.FlightRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {
    private final FlightRepository flightRepository;

    public FlightResponseDto addFlight(FlightRequestDto dto)
    {
        Flight newFlight = new Flight();

        newFlight.setAirlineName(dto.airlineName());
        newFlight.setFlightNumber(dto.flightNumber());
        newFlight.setArrivalTime(dto.arrivalTime());
        newFlight.setDepartureTime(dto.departureTime());
        newFlight.setSource(dto.source());
        newFlight.setDestination(dto.destination());
        newFlight.setPrice(dto.price());
        newFlight.setTotalSeats(dto.totalSeats());
        newFlight.setAvailableSeats(dto.totalSeats());

        if(dto.stops()!=null)
        {
            for(FlightStopRequestDto stopDto: dto.stops())
            {
                FlightStop stop = new FlightStop();
                stop.setCity(stopDto.city());
                stop.setArrivalTime(stopDto.arrivalTime());
                stop.setDepartureTime(stopDto.departureTime());
                stop.setStopOrder(stopDto.stopOrder());

                stop.setFlight(newFlight);

                newFlight.getIntermediateStops().add(stop);
            }
        }

        Flight savedFlight = flightRepository.save(newFlight);

        return FlightResponseDto.fromEntity(savedFlight);
    }

    public List<FlightResponseDto> searchFlights(String source, String destination, LocalDate travelDate)
    {
        LocalDateTime startOfDay = travelDate.atStartOfDay();
        LocalDateTime endOfDay = travelDate.atTime(23,59,59);

        List<Flight> flights  = flightRepository.findBySourceAndDestinationAndDepartureTimeBetween(
                source,destination,startOfDay,endOfDay
        );

        return flights.stream().map(FlightResponseDto::fromEntity).toList();
    }

    public  List<FlightResponseDto> allFlights()
    {
        List<Flight> flights = flightRepository.findAll();
        return flights.stream().map(FlightResponseDto::fromEntity).toList();
    }

    @Transactional
    public void deleteFlight(Long flightId)
    {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(()-> new RuntimeException("Flight Not Found with Id: "+flightId));
        flightRepository.delete(flight);
    }
}
