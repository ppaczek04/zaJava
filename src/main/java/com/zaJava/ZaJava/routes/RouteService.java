package com.zaJava.ZaJava.routes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class RouteService {

    @Value("${google.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RouteService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RouteResponse getRoute(RouteRequest routeRequest) {
        String url = "https://routes.googleapis.com/directions/v2:computeRoutes?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "ya29.a0AcM612xu_DwirHYbhXcrPvApV-jald5W_siAZF8Y6fYCxE3eKJgb8s_NuxenkQOza1VFL80J1qCugx5XtXVUdN8bHu4_v-bXbCvG2dZfN2yZ7SvtE5QWHgJEQEEKwCyAoRTM1a8777-l8o0QvegtoohdyVpXBSOjJCt_aCgYKAYsSARASFQHGX2MiAc03sKVszWuURK6pg1RJsg0171");
        headers.set("X-Goog-UserProject", "routesproapi");
        headers.set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline");

        HttpEntity<RouteRequest> request = new HttpEntity<>(routeRequest, headers);

        ResponseEntity<RouteResponse> response = restTemplate.exchange(url, HttpMethod.POST, request, RouteResponse.class);

        return response.getBody();
    }
}

