package com.zaJava.ZaJava.routes;

import java.util.List;

public class RouteResponse {
    private List<Route> routes;

    public List<Route> getRoutes() {return routes;}

    public void setRoutes(List<Route> routes) {this.routes = routes;}

    public static class Route {
        private int distanceMeters;
        private String duration;
        private Polyline polyline;

        public int getDistanceMeters() {return distanceMeters;}
        public void setDistanceMeters(int distanceMeters) {this.distanceMeters = distanceMeters;}
        public String getDuration() {return duration;}
        public void setDuration(String duration) {this.duration = duration;}
        public Polyline getPolyline() {return polyline;}
        public void setPolyline(Polyline polyline) {this.polyline = polyline;}

        public static class Polyline {
            private String encodedPolyline;

            public String getEncodedPolyline() {return encodedPolyline;}
            public void setEncodedPolyline(String encodedPolyline) {this.encodedPolyline = encodedPolyline;}
        }
    }
}