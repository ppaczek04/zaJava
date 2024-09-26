package com.zaJava.ZaJava.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Point {
    @Override
    public String toString() {
        return "Point{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                ", place_id='" + placeId + '\'' +
                '}';
    }

    private double latitude;
    private double longitude;
    private String placeId;

}
