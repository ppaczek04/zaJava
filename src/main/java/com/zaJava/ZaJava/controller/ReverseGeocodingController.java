package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.requests.ReverseGeocodingRequest;
import com.zaJava.ZaJava.service.ReverseGeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/address")
public class ReverseGeocodingController {

    private final ReverseGeocodingService reverseGeocodingService;

    @Autowired
    public ReverseGeocodingController(ReverseGeocodingService reverseGeocodingService) {
        this.reverseGeocodingService = reverseGeocodingService;
    }

    // Odbiera zapytanie POST i przekazuje współrzędne do serwisu
    @PostMapping("/get")
    public ResponseEntity<String> getAddress(@RequestBody ReverseGeocodingRequest reverseGeocodingRequest) {
        try {
            // Wywołanie serwisu, który pobiera adres na podstawie współrzędnych
            String address = reverseGeocodingService.getAddress(reverseGeocodingRequest);
            return ResponseEntity.ok(address); // Zwraca adres w odpowiedzi
        } catch (Exception e) {
            // W razie błędu zwróć kod 500 i wiadomość o błędzie
            return ResponseEntity.status(500).body("Error retrieving address: " + e.getMessage());
        }
    }
}

