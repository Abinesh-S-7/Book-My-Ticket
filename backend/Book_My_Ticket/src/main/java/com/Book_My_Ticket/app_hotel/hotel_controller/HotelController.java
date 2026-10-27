package com.Book_My_Ticket.app_hotel.hotel_controller;

import com.Book_My_Ticket.app_hotel.dto.HotelRequestDto;
import com.Book_My_Ticket.app_hotel.dto.HotelResponseDto;
import com.Book_My_Ticket.app_hotel.hotel_service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {
    private final HotelService hotelService;

    @PostMapping("/add")
    public ResponseEntity<HotelResponseDto> addHotel(@Valid @RequestBody HotelRequestDto dto)
    {
        return new ResponseEntity<>(hotelService.addHotel(dto), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelResponseDto>> searchHotels(@RequestParam String city)
    {
        return new ResponseEntity<>(hotelService.searchHotels(city),HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HotelResponseDto>> getAllHotels() {
        return new ResponseEntity<>(hotelService.getAllHotels(), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return new ResponseEntity<>("Hotel deleted successfully", HttpStatus.OK);
    }
}
