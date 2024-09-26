package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Journey;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.JourneyRepository;
import org.springframework.stereotype.Service;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;

    public JourneyService(JourneyRepository journeyRepository) {
        this.journeyRepository = journeyRepository;
    }

    public Journey saveJourney(Journey journey) {
        for (Route route : journey.getRoutes()) {
            route.setJourney(journey);
            if (route.getDetails() != null) {
                route.getDetails().setRoute(route);
            }
        }
        return journeyRepository.save(journey);
    }
}
