package com.zaJava.ZaJava.places;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PlacesService {

    private final WebClient webClient;
    private final PlacesMapper placesMapper;

    public PlacesService(@Value("${google.api.key}") String apiKey, PlacesMapper placesMapper) {
        this.webClient = WebClient.builder()
                .baseUrl("https://places.googleapis.com/v1/places")
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("X-Goog-Api-Key", apiKey)
                .build();
        this.placesMapper = placesMapper;
    }

    public Mono<String> searchNearbyRestaurants(RestaurantDto request) {
        String url = ":searchNearby";

        String requestBody = placesMapper.getRequestBodyNearbySearch(
                new String[]{"restaurant"},
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius()
        );

        return webClient.post()
                .uri(url)
                .header(
                        "X-Goog-FieldMask",
                        "places.displayName.text",
                        "places.location",
                        "places.rating",
                        "places.websiteUri",
                        "places.regularOpeningHours.weekdayDescriptions"
                )
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}

