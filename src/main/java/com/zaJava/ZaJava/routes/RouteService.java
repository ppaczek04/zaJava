package com.zaJava.ZaJava.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
public class RouteService {

    private final WebClient webClient;

    @Autowired
    public RouteService(WebClient webClient) {
        this.webClient = webClient;
    }

    public RouteLine calculateRoute(MapPoint origin, MapPoint destination) {
        try {
            String apiKey = "YOUR_API_KEY"; // Replace with your Google API key
            String requestBody = String.format(
                    "{\n" +
                            "  \"origin\": {\n" +
                            "    \"location\": {\n" +
                            "      \"latLng\": {\n" +
                            "        \"latitude\": %f,\n" +
                            "        \"longitude\": %f\n" +
                            "      }\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"destination\": {\n" +
                            "    \"location\": {\n" +
                            "      \"latLng\": {\n" +
                            "        \"latitude\": %f,\n" +
                            "        \"longitude\": %f\n" +
                            "      }\n" +
                            "    }\n" +
                            "  },\n" +
                            "  \"travelMode\": \"DRIVE\"\n" +
                            "}",
                    origin.getLatitude(), origin.getLongtude(),
                    destination.getLatitude(), destination.getLongtude()
            );

            String apiUrl = "https://routes.googleapis.com/directions/v2:computeRoutes";
            RouteLine route = webClient.post()
                    .uri(apiUrl)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + "YOUR_OAUTH_TOKEN")
                    .header("X-Goog-User-Project", "YOUR_PROJECT_ID")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(RouteLine.class)
                    .block();

            // Set start and end points
            route.setStartPoint(origin);
            route.setEndPoint(destination);
            return route;

        } catch (WebClientResponseException ex) {
            // Handle error here, e.g., log it or throw a custom exception
            ex.printStackTrace();
            return null;
        }
    }
}
