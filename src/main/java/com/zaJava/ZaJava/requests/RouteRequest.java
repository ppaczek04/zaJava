package com.zaJava.ZaJava.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {
    private LegRequest.LocationDTO origin;
    private LegRequest.LocationDTO destination;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDTO {
        private double latitude;
        private double longitude;
    }
}
