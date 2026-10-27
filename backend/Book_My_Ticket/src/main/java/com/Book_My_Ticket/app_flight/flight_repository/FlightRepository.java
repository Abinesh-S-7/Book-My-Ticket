package com.Book_My_Ticket.app_flight.flight_repository;

import com.Book_My_Ticket.app_flight.flight_entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight,Long> {
    List<Flight> findBySourceAndDestination(String source,String destination);

    List<Flight> findBySourceAndDestinationAndDepartureTimeBetween(
            String source,
            String destination,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    );

}
