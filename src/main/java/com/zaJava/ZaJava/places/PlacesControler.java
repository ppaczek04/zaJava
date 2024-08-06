package com.zaJava.ZaJava.places;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlacesControler {

    private final PlacesService placesService;

    public PlacesControler(PlacesService placesService) {
        this.placesService = placesService;
    }

    @GetMapping("/restaurants")
    public String getRestaurants(
            @RequestParam double lat,
            @RequestParam double lng
    ) {
        return placesService.findRestaurant(lat, lng);
    }
}
