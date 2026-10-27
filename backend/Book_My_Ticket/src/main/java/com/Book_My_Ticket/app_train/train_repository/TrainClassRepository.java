package com.Book_My_Ticket.app_train.train_repository;

import com.Book_My_Ticket.app_train.train_entity.TrainClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainClassRepository extends JpaRepository<TrainClass,Long> {
}
