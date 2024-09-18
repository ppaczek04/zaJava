package com.zaJava.ZaJava.service;

import com.zaJava.ZaJava.model.ReverseGeocodingResponse;
import com.zaJava.ZaJava.requests.ReverseGeocodingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ReverseGeocodingService {
    @Value("${google.api.key}")
    private String apiKey;
    @Autowired
    private WebClient.Builder webClientBuilder;

    public String getAddress(ReverseGeocodingRequest reverseGeocodingRequest) {
        String baseURL = "https://maps.googleapis.com/maps/api/geocode";
        String endPoint = "/json";


        String latlng = reverseGeocodingRequest.getPoint().getLatitude() + "," + reverseGeocodingRequest.getPoint().getLongitude();

        return webClientBuilder
                .baseUrl(baseURL)
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path(endPoint)
                        .queryParam("latlng", latlng)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(ReverseGeocodingResponse.class)
                .map(reverseGeocodingResponse -> {
                    if (reverseGeocodingResponse.getResults() != null && !reverseGeocodingResponse.getResults().isEmpty()) {
                        return reverseGeocodingResponse.getResults().get(0).getFormatted_address();
                    } else {
                        throw new RuntimeException("No address found");
                    }
                })
                .block();
    }
}

