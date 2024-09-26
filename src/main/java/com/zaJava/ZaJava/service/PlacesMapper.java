package com.zaJava.ZaJava.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

import com.zaJava.ZaJava.model.LocationDto;
import com.zaJava.ZaJava.model.PlacesDto;
import com.zaJava.ZaJava.model.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlacesMapper {

    public String getRequestBodyNearbySearch(String[] types, double latitude, double longitude, double radius) {
        Map<String, Object> nearbySearchBody = new HashMap<>();

        nearbySearchBody.put("includedTypes", types);

        nearbySearchBody.put("maxResultCount", 10);

        Map<String, Object> center = new HashMap<>();
        center.put("latitude", latitude);
        center.put("longitude", longitude);

        Map<String, Object> circle = new HashMap<>();
        circle.put("center", center);
        circle.put("radius", radius);

        Map<String, Object> locationRestriction = new HashMap<>();
        locationRestriction.put("circle", circle);

        nearbySearchBody.put("locationRestriction", locationRestriction);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(nearbySearchBody);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }

    public List<Point> parsePoints(String value) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Point> points = new ArrayList<>();
        System.out.println(value);

        try {
            // Deserializowanie JSON do obiektu PlacesDto
            PlacesDto response = objectMapper.readValue(value, PlacesDto.class);

            // Sprawdzanie, czy response.getPlaces() nie jest null
            if (response != null && response.getPlaces() != null) {
                for (LocationDto place : response.getPlaces()) {
                    if (place != null) {
                        Point point = place.getLocation();
                        point.setPlaceId(place.getId());
                        points.add(point);
                    }
                }
            } else {
                System.out.println("response.getPlaces() is null");
            }
        } catch (IOException e) {
            // Logowanie błędów
            e.printStackTrace();
            System.out.println("Error parsing JSON: " + e.getMessage());
        }

        return points;
    }
}
