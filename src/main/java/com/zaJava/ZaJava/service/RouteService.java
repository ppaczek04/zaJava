package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.RouteRepository;
import com.zaJava.ZaJava.requests.LegRequest;
import org.springframework.stereotype.Service;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route save(Route route) {
        return routeRepository.save(route);
    }

}
