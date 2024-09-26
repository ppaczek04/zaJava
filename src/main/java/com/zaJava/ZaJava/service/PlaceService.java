package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.repositories.PlaceRepository;
import com.zaJava.ZaJava.requests.MapPointRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceService {
    private final PlaceRepository placeRepository;

    public PlaceService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

//    public List<Place> getPoints(MapPointRequest mapPointRequest) {
//        return placeRepository.findByRoute_Id(mapPointRequest.getRouteId());
//    }
}
