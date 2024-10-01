package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Journey;
import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.model.RouteDetails;
import com.zaJava.ZaJava.repositories.JourneyRepository;
import com.zaJava.ZaJava.repositories.RouteRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

@Service
public class JourneyService {

    private final JourneyRepository journeyRepository;
    private final PlaceService placeService;
    private final RouteRepository routeRepository;


    public JourneyService(JourneyRepository journeyRepository, PlaceService placeService, RouteRepository routeRepository) {
        this.journeyRepository = journeyRepository;
        this.placeService = placeService;
        this.routeRepository = routeRepository;
    }

    public Journey saveJourney(Journey journey) {
        for (Route route : journey.getRoutes()) {
            route.setJourney(journey);
            if (route.getDetails() != null) {
                route.getDetails().setRoute(route);
            }

            if (route.getHome() != null) {
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

    public String getTotalJourneyDistance(String title) {
        List<Route> routes = routeRepository.findRoutesByJourneyTitle(title);

        if (routes.isEmpty()) {
            throw new RuntimeException("No routes found for the given journey title: " + title);
        }

        int totalDistance = 0;

        for (Route route : routes) {
            RouteDetails details = route.getDetails();

            if (details != null && details.getTime() != null) {
                try {
                    String distanceString = details.getDistance();
                    totalDistance += Integer.parseInt(distanceString);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid distance format for route: " + route.getId(), e);
                }
            } else {
                throw new RuntimeException("Missing route details or distance for route: " + route.getId());
            }
        }

        return Integer.toString(totalDistance);
    }

    public String getTotalJourneyTime(String title) {
        // Pobranie tras powiązanych z tytułem podróży
        List<Route> routes = routeRepository.findRoutesByJourneyTitle(title);

        // Sprawdzenie, czy lista tras jest pusta
        if (routes.isEmpty()) {
            throw new RuntimeException("Nie znaleziono tras dla podanej nazwy podróży: " + title);
        }

        int totalTime = 0;

        for (Route route : routes) {
            RouteDetails details = route.getDetails();

            if (details != null && details.getTime() != null) {
                try {
                    String timeString = details.getTime();

                    if (timeString.endsWith("s")) {
                        timeString = timeString.substring(0, timeString.length() - 1);
                    }

                    totalTime += Integer.parseInt(timeString);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Niepoprawny format czasu dla trasy: " + route.getId(), e);
                }
            } else {
                throw new RuntimeException("Brak szczegółów trasy lub brak czasu dla trasy: " + route.getId());
            }
        }

        return Integer.toString(totalTime);
    }


}
