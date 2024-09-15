package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.Leg;
import com.zaJava.ZaJava.model.MapPoint;
import com.zaJava.ZaJava.repositories.LegRepository;
import com.zaJava.ZaJava.repositories.MapPointRepository;
import com.zaJava.ZaJava.routes.LegRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LegService {
    private final LegRepository legRepository;
    private final MapPointRepository mapPointRepository;

    public LegService(LegRepository legRepository, MapPointRepository mapPointRepository) {
        this.legRepository = legRepository;
        this.mapPointRepository = mapPointRepository;
    }
    public int save(LegRequest legRequest) {
        MapPoint origin = MapPoint.builder()
                .latitude(legRequest.getOrigin().getLatitude())
                .longitude(legRequest.getOrigin().getLongitude())
                .build();
        MapPoint destination = MapPoint.builder()
                .latitude(legRequest.getDestination().getLatitude())
                .longitude(legRequest.getDestination().getLongitude())
                .build();

        List<MapPoint> points = new java.util.ArrayList<>(List.of());
        points.add(origin);
        points.add(destination);

        Leg leg = Leg.builder()
                .polyline(legRequest.getPolyline())
                .points(points)
                .build();
        legRepository.save(leg);

        origin.setLeg(leg);
        destination.setLeg(leg);
        mapPointRepository.save(origin);
        mapPointRepository.save(destination);

        return leg.getId();
    }
}
