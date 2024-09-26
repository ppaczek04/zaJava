//package com.zaJava.ZaJava.controller;
//
//import com.zaJava.ZaJava.requests.LegRequest;
//import com.zaJava.ZaJava.service.RouteService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/leg")
//public class LegController {
//    private final RouteService routeService;
//
//    @Autowired
//    public LegController(RouteService routeService) {
//        this.routeService = routeService;
//    }
//
//    @PostMapping("/save")
//    public ResponseEntity<Integer> saveLeg(@RequestBody LegRequest legRequest) {
//        Integer legId = routeService.save(legRequest);
//        return ResponseEntity.ok(legId);
//    }
//}
