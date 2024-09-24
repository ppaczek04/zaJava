package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Leg;
import com.zaJava.ZaJava.model.MapPoint;
import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.repositories.LegRepository;
import com.zaJava.ZaJava.repositories.MapPointRepository;
import com.zaJava.ZaJava.repositories.RouteRepository;
import com.zaJava.ZaJava.requests.LegRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LegService {
    private final LegRepository legRepository;
    private final MapPointRepository mapPointRepository;
    private final RouteRepository routeRepository;

    public LegService(LegRepository legRepository, MapPointRepository mapPointRepository, RouteRepository routeRepository) {
        this.legRepository = legRepository;
        this.mapPointRepository = mapPointRepository;
        this.routeRepository = routeRepository;
    }
    public int save(LegRequest legRequest) {
        Optional<Route> routeOptional = routeRepository.findById(legRequest.getRouteId());
        Route route = routeOptional.orElseThrow(() -> new RuntimeException("Route not found"));

        MapPoint origin = MapPoint.builder()
                .latitude(legRequest.getOrigin().getLatitude())
                .longitude(legRequest.getOrigin().getLongitude())
                .route(route)
                .build();
        MapPoint destination = MapPoint.builder()
                .latitude(legRequest.getDestination().getLatitude())
                .longitude(legRequest.getDestination().getLongitude())
                .route(route)
                .build();

        List<MapPoint> points = new java.util.ArrayList<>(List.of());
        points.add(origin);
        points.add(destination);

        Leg leg = Leg.builder()
                .polyline(legRequest.getPolyline())
                .points(points)
                .build();
        leg.setRoute(route);
        legRepository.save(leg);

        origin.setLeg(leg);
        destination.setLeg(leg);
        mapPointRepository.save(origin);
        mapPointRepository.save(destination);

        return leg.getId();
    }
}
