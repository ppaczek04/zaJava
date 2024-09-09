package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Route;
import com.zaJava.ZaJava.routes.RouteRequest;
import com.zaJava.ZaJava.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/route")
public class RouteController {
    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/save")
    public ResponseEntity<Integer> saveRoute(@RequestBody RouteRequest routeRequest) {
        Integer routeId = routeService.save(routeRequest);
        return ResponseEntity.ok(routeId);
    }
}


