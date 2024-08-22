package com.zaJava.ZaJava.places;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PlacesDto {
    @JsonProperty("places")
    private List<LocationDto> places;

    public List<LocationDto> getPlaces() {
        return places;
    }

    public void setPlaces(List<LocationDto> places) {
        this.places = places;
    }
}
