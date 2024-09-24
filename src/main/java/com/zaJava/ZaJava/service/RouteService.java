package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.MapPoint;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.MapPointRepository;
import com.zaJava.ZaJava.repositories.RouteRepository;
import com.zaJava.ZaJava.requests.RouteRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {
    private final MapPointRepository mapPointRepository;
    private final RouteRepository routeRepository;

    @Autowired
    public RouteService(MapPointRepository mapPointRepository, RouteRepository routeRepository) {
        this.mapPointRepository = mapPointRepository;
        this.routeRepository = routeRepository;
    }

    public int save(RouteRequest routeRequest) {
        MapPoint origin = MapPoint.builder()
                .latitude(routeRequest.getOrigin().getLatitude())
                .longitude(routeRequest.getOrigin().getLongitude())
                .build();
        MapPoint destination = MapPoint.builder()
                .latitude(routeRequest.getDestination().getLatitude())
                .longitude(routeRequest.getDestination().getLongitude())
                .build();

        List<MapPoint> points = new java.util.ArrayList<>(List.of());
        points.add(origin);
        points.add(destination);

        Route route = Route.builder()
                .points(points)
                .build();
        routeRepository.save(route);

        origin.setRoute(route);
//        destination.setRoute(route);
        mapPointRepository.save(origin);
//        mapPointRepository.save(destination);

        return route.getId();
    }

}
