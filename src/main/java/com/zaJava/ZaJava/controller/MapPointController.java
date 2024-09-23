package com.zaJava.ZaJava.controller;
import org.apache.commons.lang3.tuple.Pair;
import com.zaJava.ZaJava.model.MapPoint;
import com.zaJava.ZaJava.requests.MapPointRequest;
import com.zaJava.ZaJava.service.MapPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mappoint")
public class MapPointController {
    private final MapPointService mapPointService;

    @Autowired
    public MapPointController(MapPointService mapPointService) {
        this.mapPointService = mapPointService;
    }

    @PostMapping("/getbyrouteid")
    public ResponseEntity<List<List<Double>>> getPoints(@RequestBody MapPointRequest mapPointRequest) {
        List<MapPoint> points = mapPointService.getPoints(mapPointRequest);
        List<List<Double>> coordsList = new ArrayList<>();
        for (MapPoint point : points) {
            List<Double> temp = new ArrayList<>();
            temp.add(point.getLatitude());
            temp.add(point.getLongitude());
            coordsList.add(temp);
        }
        return ResponseEntity.ok(coordsList);
    }
}
