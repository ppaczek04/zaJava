package com.zaJava.ZaJava.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/calculate")
    public RouteLine calculateRoute(@RequestBody MapPointRequest mapPointRequest) {
        MapPoint origin = new MapPoint(mapPointRequest.getOriginName(), mapPointRequest.getOriginLatitude(), mapPointRequest.getOriginLongitude());
        MapPoint destination = new MapPoint(mapPointRequest.getDestinationName(), mapPointRequest.getDestinationLatitude(), mapPointRequest.getDestinationLongitude());
        return routeService.calculateRoute(origin, destination);
    }
}


