package com.Book_My_Ticket.app_bus.bus_repository;

import com.Book_My_Ticket.app_bus.bus_entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BusRepository extends JpaRepository<Bus,Long> {

    List<Bus> findBySourceAndDestinationAndDepartureTimeBetween
            (String source, String destination, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
