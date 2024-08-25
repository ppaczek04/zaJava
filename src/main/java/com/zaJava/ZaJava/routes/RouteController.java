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

    @PostMapping("/compute")
    public RouteResponse computeRoute(@RequestBody RouteRequest routeRequest) {
        return routeService.getRoute(routeRequest);
    }
}


