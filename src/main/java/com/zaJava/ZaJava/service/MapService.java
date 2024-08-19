package com.zaJava.ZaJava.service;


import com.zaJava.ZaJava.model.GeocodingResponse;
import com.zaJava.ZaJava.model.Location;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MapService {
    @Value("${google.api.key}")
    private String apiKey;

    public void addCoordinates( Location location){
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                location.getCity()+ "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        GeocodingResponse response = restTemplate.getForObject(url, GeocodingResponse.class);
        if (response != null && !response.getResults().isEmpty()) {
            Location coordinates = response.getResults().get(0).getGeometry().getLocation();
            location.setLat(coordinates.getLat());
            location.setLng(coordinates.getLng());
        } else {
            System.out.println("No results found for the provided address.");
        }
    }
}
