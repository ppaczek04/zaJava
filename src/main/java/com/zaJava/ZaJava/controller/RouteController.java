//package com.zaJava.ZaJava.controller;
//
//import com.zaJava.ZaJava.requests.RouteRequest;
//import com.zaJava.ZaJava.service.RouteDetailsService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/route")
//public class RouteController {
//    private final RouteDetailsService routeDetailsService;
//
//    @Autowired
//    public RouteController(RouteDetailsService routeDetailsService) {
//        this.routeDetailsService = routeDetailsService;
//    }
//
//    @PostMapping("/save")
//    public ResponseEntity<Integer> saveRoute(@RequestBody RouteRequest routeRequest) {
//        Integer routeId = routeDetailsService.save(routeRequest);
//        return ResponseEntity.ok(routeId);
//    }
//}


