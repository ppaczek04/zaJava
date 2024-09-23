package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.requests.LegRequest;
import com.zaJava.ZaJava.service.LegService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/leg")
public class LegController {
    private final LegService legService;

    @Autowired
    public LegController(LegService legService) {
        this.legService = legService;
    }

    @PostMapping("/save")
    public ResponseEntity<Integer> saveLeg(@RequestBody LegRequest legRequest) {
        Integer legId = legService.save(legRequest);
        return ResponseEntity.ok(legId);
    }
}
