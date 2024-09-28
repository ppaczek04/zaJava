package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Journey;
import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.JourneyRepository;
import org.springframework.stereotype.Service;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final PlaceService placeService;

    public JourneyService(JourneyRepository journeyRepository, PlaceService placeService) {
        this.journeyRepository = journeyRepository;
        this.placeService = placeService;
    }

    public Journey saveJourney(Journey journey) {
        for (Route route : journey.getRoutes()) {
            route.setJourney(journey);
            if (route.getDetails() != null) {
                route.getDetails().setRoute(route);
            }

            if(route.getHome() != null) {
                Place existingHome = placeService.findByLatitudeAndLongitude(
                        route.getHome().getLatitude(), route.getHome().getLongitude());
                if (existingHome != null) {
                    route.setHome(existingHome);
                } else {
                    placeService.savePlace(route.getHome());
                }
            }

            if (route.getDestination() != null) {
                Place existingDestination = placeService.findByLatitudeAndLongitude(
                        route.getDestination().getLatitude(), route.getDestination().getLongitude());
                if (existingDestination != null) {
                    route.setDestination(existingDestination);
                } else {
                    placeService.savePlace(route.getDestination());
                }
            }

        }
        return journeyRepository.save(journey);
    }
}
