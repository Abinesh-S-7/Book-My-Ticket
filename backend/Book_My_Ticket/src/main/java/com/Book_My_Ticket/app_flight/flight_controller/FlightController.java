package com.Book_My_Ticket.app_flight.flight_controller;

import com.Book_My_Ticket.app_flight.dto.FlightRequestDto;
import com.Book_My_Ticket.app_flight.dto.FlightResponseDto;
import com.Book_My_Ticket.app_flight.flight_service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/add")
    public ResponseEntity<FlightResponseDto> addFlight(@Valid @RequestBody FlightRequestDto dto)
    {
        return new ResponseEntity<>(flightService.addFlight(dto), HttpStatus.CREATED);
    }

    @GetMapping("/search")

    public ResponseEntity<List<FlightResponseDto>> searchFlight(@RequestParam String source,
                                                                @RequestParam String destination,
                                                                @RequestParam
                                                                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate date)
    {
        return new ResponseEntity<>(flightService.searchFlights(source, destination, date),HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<FlightResponseDto>> allFlights()
    {
        return new ResponseEntity<>(flightService.allFlights(),HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return new ResponseEntity<>("Flight deleted successfully", HttpStatus.OK);
    }

}
