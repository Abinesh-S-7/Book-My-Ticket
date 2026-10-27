package com.Book_My_Ticket.app_train.train_controller;

import com.Book_My_Ticket.app_train.train_service.TrainService;
import com.Book_My_Ticket.app_train.dto.TrainRequestDto;
import com.Book_My_Ticket.app_train.dto.TrainResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @PostMapping("/add")
    public ResponseEntity<TrainResponseDto> createTrain(@Valid @RequestBody TrainRequestDto dto)
    {
        return new ResponseEntity<>(trainService.addTrain(dto), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainResponseDto>> searchTrains(@RequestParam String source,
                                                               @RequestParam String destination,
                                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date)
    {
        return new ResponseEntity<>(trainService.searchTrain(source,destination,date),HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TrainResponseDto>> getAllTrains() {
        return new ResponseEntity<>(trainService.getAllTrains(), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
        return new ResponseEntity<>("Train deleted successfully", HttpStatus.OK);
    }
}
