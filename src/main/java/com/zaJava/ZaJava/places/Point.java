package com.zaJava.ZaJava.places;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Point {
    private double latitude;
    private double longitude;

    @Override
    public String toString() {
        return "Point{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
