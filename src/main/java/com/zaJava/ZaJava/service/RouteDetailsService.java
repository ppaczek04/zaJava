package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.model.RouteDetails;
import com.zaJava.ZaJava.repositories.RouteDetailsRepository;
import com.zaJava.ZaJava.requests.RouteRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteDetailsService {
    private final RouteDetailsRepository routeDetailsRepository;
    @Autowired
    public RouteDetailsService(RouteDetailsRepository routeDetailsRepository) {
        this.routeDetailsRepository = routeDetailsRepository;
    }


    public RouteDetails save(RouteDetails routeDetails) {
        return routeDetailsRepository.save(routeDetails);
    }

}
