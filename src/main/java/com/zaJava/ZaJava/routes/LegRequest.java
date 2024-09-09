package com.zaJava.ZaJava.routes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LegRequest {
    private LocationDTO origin;
    private LocationDTO destination;
    private String polyline;
    //private Integer routeId;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationDTO {
        private double latitude;
        private double longitude;
    }
}
