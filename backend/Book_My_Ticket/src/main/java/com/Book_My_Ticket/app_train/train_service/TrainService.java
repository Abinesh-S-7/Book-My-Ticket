package com.Book_My_Ticket.app_train.train_service;

import com.Book_My_Ticket.app_train.dto.TrainClassRequestDto;
import com.Book_My_Ticket.app_train.dto.TrainRequestDto;
import com.Book_My_Ticket.app_train.dto.TrainResponseDto;
import com.Book_My_Ticket.app_train.dto.TrainRouteRequestDto;
import com.Book_My_Ticket.app_train.train_entity.Train;
import com.Book_My_Ticket.app_train.train_entity.TrainClass;
import com.Book_My_Ticket.app_train.train_entity.TrainRoute;
import com.Book_My_Ticket.app_train.train_repository.TrainRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TrainService {
    private final TrainRepository trainRepository;

    public TrainResponseDto addTrain(TrainRequestDto dto)
    {
        Train newTrain = new Train();
        newTrain.setTrainNumber(dto.trainNumber());
        newTrain.setTrainName(dto.trainName());
        newTrain.setSource(dto.source());
        newTrain.setDestination(dto.destination());
        newTrain.setArrivalTime(dto.arrivalTime());
        newTrain.setDepartureTime(dto.departureTime());

        if(dto.routes()!=null)
        {
            for (TrainRouteRequestDto route:dto.routes())
            {
                TrainRoute trainRoute = new TrainRoute();
                trainRoute.setStationName(route.stationName());
                trainRoute.setArrivalTime(route.arrivalTime());
                trainRoute.setDepartureTime(route.departureTime());
                trainRoute.setStopOrder(route.stopOrder());

                trainRoute.setTrain(newTrain);

                newTrain.getRoutes().add(trainRoute);
            }
        }

        if(dto.classes()!=null)
        {
            for(TrainClassRequestDto classes: dto.classes())
            {
                TrainClass trainClass = new TrainClass();
                trainClass.setClassName(classes.className());
                trainClass.setTotalSeats(classes.totalSeats());
                trainClass.setAvailableSeats(classes.totalSeats());
                trainClass.setPrice(classes.price());

                trainClass.setTrain(newTrain);

                newTrain.getClasses().add(trainClass);
            }
        }

        Train savedTrain = trainRepository.save(newTrain);

        return TrainResponseDto.fromEntity(savedTrain);
    }

    public List<TrainResponseDto> searchTrain(
            String source,
            String destination,
            LocalDate travelDate
    )
    {
        LocalDateTime startOfDay = travelDate.atStartOfDay();
        LocalDateTime endOfDay = travelDate.atTime(23,59,59);

        List<Train> trains = trainRepository.findBySourceAndDestinationAndDepartureTimeBetween
                (source,destination,startOfDay,endOfDay);
        return trains.stream().map(TrainResponseDto::fromEntity).toList();
    }

    public List<TrainResponseDto> getAllTrains() {
        return trainRepository.findAll()
                .stream()
                .map(TrainResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public void deleteTrain(Long trainId) {
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new RuntimeException("Train not found with ID: " + trainId));
        trainRepository.delete(train);
    }
}
