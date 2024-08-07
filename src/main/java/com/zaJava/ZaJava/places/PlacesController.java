package com.zaJava.ZaJava.places;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/places")
public class PlacesController {

    private final PlacesService placesService;

    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    @PostMapping("/restaurants")
    public Mono<String> getNearbyRestaurants(@RequestBody RestaurantDto request) {
        return placesService.searchNearbyRestaurants(request);
    }
}

