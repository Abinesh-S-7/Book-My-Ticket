package com.Book_My_Ticket.app_user.user_controller;

import com.Book_My_Ticket.app_user.dto.UserDashboardResponseDto;
import com.Book_My_Ticket.app_user.user_service.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class UserDashboardController {

    private final UserDashboardService userDashboardService;

    @GetMapping("/my-trips")
    public ResponseEntity<UserDashboardResponseDto> getUserDashboard(Principal principal) {

        String email = principal.getName();
        return new ResponseEntity<>(userDashboardService.getUserDashboard(email), HttpStatus.OK);
    }
}