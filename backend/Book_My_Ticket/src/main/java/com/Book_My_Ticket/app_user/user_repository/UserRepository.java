package com.Book_My_Ticket.app_user.user_repository;

import com.Book_My_Ticket.app_user.user_entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}
