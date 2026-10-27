package com.Book_My_Ticket.app_bus.bus_controller;

import com.Book_My_Ticket.app_bus.dto.BusRequestDto;
import com.Book_My_Ticket.app_bus.dto.BusResponseDto;
import com.Book_My_Ticket.app_bus.bus_service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @PostMapping("/add")
    public ResponseEntity<BusResponseDto> createBus(@Valid @RequestBody BusRequestDto dto) {
        return new ResponseEntity<>(busService.addBus(dto), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BusResponseDto>> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return new ResponseEntity<>(busService.searchBuses(source, destination, date), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BusResponseDto>> getAllBuses() {
        return new ResponseEntity<>(busService.getAllBuses(), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return new ResponseEntity<>("Bus deleted successfully", HttpStatus.OK);
    }
}