package com.Book_My_Ticket.app_train.train_repository;

import com.Book_My_Ticket.app_train.train_entity.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRouteRepository extends JpaRepository<TrainRoute,Long> {
}
