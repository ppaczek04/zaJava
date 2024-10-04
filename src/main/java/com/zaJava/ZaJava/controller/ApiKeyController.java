package com.zaJava.ZaJava.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ApiKeyController {

    @Value("${google.api.key}")
    private String googleApiKey;

    @GetMapping("/api/google-api-key")
    public Map<String, String> getGoogleApiKey() {
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", googleApiKey);
        return response;
    }
}
