package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route save(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutesByJourneyTitle(String title) {
        return routeRepository.findRoutesByJourneyTitle(title);
    }

    public List<String> getAllPolylinesByJourneyTitle(String title) {
        return routeRepository.findPolylinesByJourneyTitle(title);
    }
}
