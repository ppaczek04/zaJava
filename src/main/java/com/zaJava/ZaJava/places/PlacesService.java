package com.zaJava.ZaJava.places;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PlacesService {

    @Value("${google.api.key}")
    private String googleApiKey;

    private final RestTemplate restTemplate;

    public PlacesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String findRestaurant(double lat, double lng) {
        String url = String.format("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=1500&type=restaurant&key=%s",
                lat, lng, googleApiKey);

        return restTemplate.getForObject(url, String.class);
    }
}
