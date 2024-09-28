package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.PlaceRepository;
import com.zaJava.ZaJava.repositories.RouteRepository;
import com.zaJava.ZaJava.requests.MapPointRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceService {
    private final PlaceRepository placeRepository;

    public PlaceService(PlaceRepository placeRepository, RouteRepository routeRepository) {
        this.placeRepository = placeRepository;
    }

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

    public Place findByLatitudeAndLongitude(double latitude, double longitude) {
        return placeRepository.findByLatitudeAndLongitude(latitude, longitude)
                .orElse(null);
    }

    public List<Place> findByRoutes(List<Route> routes) {
        return placeRepository.findPlacesByRoutes(routes);
    }

    public List<Place> findByJourneyTitle(String journeyTitle) {
        return placeRepository.findPlacesByJourneyTitle(journeyTitle);
    }

//    public List<Place> getPoints(MapPointRequest mapPointRequest) {
//        return placeRepository.findByRoute_Id(mapPointRequest.getRouteId());
//    }
}
