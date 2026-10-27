package com.Book_My_Ticket.app_train.train_repository;

import com.Book_My_Ticket.app_train.train_entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TrainRepository extends JpaRepository<Train,Long> {
    List<Train> findBySourceAndDestinationAndDepartureTimeBetween(
            String source,
            String destination,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay);
}
