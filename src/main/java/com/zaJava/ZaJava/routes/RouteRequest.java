package com.zaJava.ZaJava.routes;

//import com.google.maps.model.LatLng;

public class RouteRequest {
    private Location origin;
    private Location destination;
    private String travelMode;


    public Location getOrigin() {return origin;}
    public void setOrigin(Location origin) {this.origin = origin;}
    public Location getDestination() {return destination;}
    public void setDestination(Location destination) {this.destination = destination;}
    public String getTravelMode() {return travelMode;}
    public void setTravelMode(String travelMode) {this.travelMode = travelMode;}

    public static class Location {
        private LatLng latLng;

        public LatLng getLatLng() {return latLng;}
        public void setLatLng(LatLng latLng) {this.latLng = latLng;}

        public static class LatLng {
            private double latitude;
            private double longitude;

            public double getLatitude() {
                return latitude;
            }
            public void setLatitude(double latitude) {
                this.latitude = latitude;
            }
            public double getLongitude() {
                return longitude;
            }
            public void setLongitude(double longitude) {
                this.longitude = longitude;
            }
        }
    }
}
