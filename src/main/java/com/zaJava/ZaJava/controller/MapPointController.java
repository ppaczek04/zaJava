//package com.zaJava.ZaJava.controller;
//import com.zaJava.ZaJava.model.Place;
//import com.zaJava.ZaJava.requests.MapPointRequest;
//import com.zaJava.ZaJava.service.PlaceService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//@RequestMapping("/mappoint")
//public class MapPointController {
//    private final PlaceService placeService;
//
//    @Autowired
//    public MapPointController(PlaceService placeService) {
//        this.placeService = placeService;
//    }
//
//    @PostMapping("/getbyrouteid")
//    public ResponseEntity<List<List<Double>>> getPoints(@RequestBody MapPointRequest mapPointRequest) {
//        List<Place> points = placeService.getPoints(mapPointRequest);
//        List<List<Double>> coordsList = new ArrayList<>();
//        for (Place point : points) {
//            List<Double> temp = new ArrayList<>();
//            temp.add(point.getLatitude());
//            temp.add(point.getLongitude());
//            coordsList.add(temp);
//        }
//        return ResponseEntity.ok(coordsList);
//    }
//}
