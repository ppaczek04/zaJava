package com.zaJava.ZaJava.places;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class PlacesService {

    private final WebClient webClient;

    @Value("${google.api.key}")
    private String apiKey;

    public PlacesService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> searchNearbyRestaurants(RestaurantDto request) {
        String url = "https://places.googleapis.com/v1/places:searchNearby";

        String requestBody = "{"
                + "\"includedTypes\": [\"restaurant\"],"
                + "\"maxResultCount\": 10,"
                + "\"locationRestriction\": {"
                + "\"circle\": {"
                + "\"center\": {"
                + "\"latitude\": " + request.getLatitude() + ","
                + "\"longitude\": " + request.getLongitude()
                + "},"
                + "\"radius\": " + request.getRadius()
                + "}"
                + "}"
                + "}";

        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .header("X-Goog-Api-Key", apiKey)
                .header("X-Goog-FieldMask", "places.displayName")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}

