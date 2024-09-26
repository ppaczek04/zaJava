package com.zaJava.ZaJava.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaJava.ZaJava.model.PlaceDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PlacesService {

    private final WebClient webClient;
    private final PlacesMapper placesMapper;
    private final ObjectMapper objectMapper;

    public PlacesService(@Value("${google.api.key}") String apiKey, PlacesMapper placesMapper, ObjectMapper objectMapper) {
        this.webClient = WebClient.builder()
                .baseUrl("https://places.googleapis.com/v1/places")
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("X-Goog-Api-Key", apiKey)
                .build();
        this.placesMapper = placesMapper;
        this.objectMapper = objectMapper;
    }

    public Mono<String> searchNearby(PlaceDto request, String[] types) {
        String url = ":searchNearby";

        String requestBody = placesMapper.getRequestBodyNearbySearch(
                types,
                request.getLatitude(),
                request.getLongitude(),
                request.getRadius()
        );

        return webClient.post()
                .uri(url)
                .header(
                        "X-Goog-FieldMask",
//                        "places.displayName.text",
                        "places.location",
                                     "places.id"
//                        "places.rating",
//                        "places.websiteUri",
//                        "places.regularOpeningHours.weekdayDescriptions"
                )
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getPlaceInfo(String placeId) {
        String sanitizedPlaceId = placeId.replace("\"", "");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/" + sanitizedPlaceId)
                        .build())
                .header(
                        "X-Goog-FieldMask",
                        "id,displayName,websiteUri,regularOpeningHours.weekdayDescriptions"
                )
                .retrieve()
                .bodyToMono(String.class);
    }
}

