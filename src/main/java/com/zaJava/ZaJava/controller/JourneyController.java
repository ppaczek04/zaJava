package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Journey;
import com.zaJava.ZaJava.service.JourneyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/journey")
public class JourneyController {

    private final JourneyService journeyService;

    @Autowired
    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    @PostMapping("/save")
    public ResponseEntity<Journey> saveJourney(@RequestBody Journey journey) {

        Journey savedJourney = journeyService.saveJourney(journey);
        return new ResponseEntity<>(savedJourney, HttpStatus.CREATED);
    }
}
