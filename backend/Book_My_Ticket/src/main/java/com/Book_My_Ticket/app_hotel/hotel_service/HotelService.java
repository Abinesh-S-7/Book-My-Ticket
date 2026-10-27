package com.Book_My_Ticket.app_hotel.hotel_service;

import com.Book_My_Ticket.app_hotel.hotel_entity.Hotel;
import com.Book_My_Ticket.app_hotel.hotel_entity.Room;
import com.Book_My_Ticket.app_hotel.hotel_entity.RoomInventory;
import com.Book_My_Ticket.app_hotel.dto.HotelRequestDto;
import com.Book_My_Ticket.app_hotel.dto.HotelResponseDto;
import com.Book_My_Ticket.app_hotel.dto.RoomInventoryRequestDto;
import com.Book_My_Ticket.app_hotel.dto.RoomRequestDto;
import com.Book_My_Ticket.app_hotel.hotel_repository.HotelRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;

    @Transactional
    public HotelResponseDto addHotel(HotelRequestDto dto)
    {
        Hotel hotel = new Hotel();
        hotel.setName(dto.name());
        hotel.setCity(dto.city());
        hotel.setAddress(dto.address());
        hotel.setStarRating(dto.starRating());
        hotel.setDescription(dto.description());

        if(dto.rooms()!=null)
        {
            for(RoomRequestDto roomResponseDto : dto.rooms())
            {
                Room room = new Room();
                room.setRoomType(roomResponseDto.roomType());
                room.setMaxOccupancy(roomResponseDto.maxOccupancy());
                room.setTotalRooms(roomResponseDto.totalRooms());

                room.setHotel(hotel);

                if(roomResponseDto.inventories()!=null)
                {
                    for(RoomInventoryRequestDto roomInventoryRequestDto: roomResponseDto.inventories())
                    {
                        RoomInventory roomInventory = new RoomInventory();
                        roomInventory.setDate(roomInventoryRequestDto.date());
                        roomInventory.setPrice(roomInventoryRequestDto.price());
                        roomInventory.setAvailableRooms(roomResponseDto.totalRooms());

                        roomInventory.setRoom(room);

                        room.getInventories().add(roomInventory);
                    }
                }

                hotel.getRooms().add(room);
            }
        }

        Hotel saved = hotelRepository.save(hotel);
        return HotelResponseDto.fromEntity(saved);

    }

    public List<HotelResponseDto> searchHotels(String city)
    {
        List<Hotel> hotels = hotelRepository.findByCityIgnoreCase(city);
        return hotels.stream().map(HotelResponseDto::fromEntity).toList();
    }

    public List<HotelResponseDto> getAllHotels() {
        return hotelRepository.findAll()
                .stream()
                .map(HotelResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public void deleteHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + hotelId));
        hotelRepository.delete(hotel);
    }
}
