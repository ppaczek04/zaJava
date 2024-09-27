package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Journey;
import com.zaJava.ZaJava.service.JourneyService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
    public ResponseEntity<?> saveJourney(@RequestBody Journey journey) {
        try {
            Journey savedJourney = journeyService.saveJourney(journey);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJourney);

        } catch (DataIntegrityViolationException e) {
            if (e.getCause() instanceof ConstraintViolationException constraintEx) {
                if (constraintEx.getConstraintName().equals("journeys_title_key")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Journey title already exists.");
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Database error occurred.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }
//    public ResponseEntity<Journey> saveJourney(@RequestBody Journey journey) {
//
//        Journey savedJourney = journeyService.saveJourney(journey);
//        return new ResponseEntity<>(savedJourney, HttpStatus.CREATED);
//    }
}
