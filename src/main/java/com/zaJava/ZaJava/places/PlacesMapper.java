package com.zaJava.ZaJava.places;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
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

        try {
            PlacesDto response = objectMapper.readValue(value, PlacesDto.class);

            for (LocationDto place : response.getPlaces()) {
                Point point = place.getLocation();
                if (point != null) {
                    points.add(point);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return points;
    }
}
