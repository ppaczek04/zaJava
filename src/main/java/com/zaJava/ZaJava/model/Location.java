package com.zaJava.ZaJava.model;

import lombok.Data;

@Data
public class Location {
    private String city;
    private double lat;
    private double lng;

    public Location(String city, double lat, double lng) {
        this.city = city;
        this.lat = lat;
        this.lng = lng;
    }

    public Location() {
    }
}
