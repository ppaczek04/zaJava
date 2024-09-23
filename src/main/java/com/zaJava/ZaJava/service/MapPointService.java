package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.MapPoint;
import com.zaJava.ZaJava.repositories.MapPointRepository;
import com.zaJava.ZaJava.requests.MapPointRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapPointService {
    private final MapPointRepository mapPointRepository;

    public MapPointService(MapPointRepository mapPointRepository) {
        this.mapPointRepository = mapPointRepository;
    }
    public List<MapPoint> getPoints(MapPointRequest mapPointRequest) {
        return mapPointRepository.findByRoute_Id(mapPointRequest.getRouteId());
    }
}
