package com.zaJava.ZaJava.places;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/places")
public class PlacesController {

    private final PlacesService placesService;

    public PlacesController(PlacesService placesService) {
        this.placesService = placesService;
    }

    @PostMapping("/restaurant")
    public Mono<String> getNearbyRestaurant(@RequestBody PlaceDto request) {
        return placesService.searchNearby(request, TypesLists.getFoodAndDrink());
    }

    @PostMapping("/entertainment")
    public Mono<String> getNearbyEntertainment(@RequestBody PlaceDto request) {
        return placesService.searchNearby(request, TypesLists.getEntertainmentAndRecreation());
    }

    @PostMapping("/culture")
    public Mono<String> getNearbyCulture(@RequestBody PlaceDto request) {
        return placesService.searchNearby(request, TypesLists.getCulture());
    }

    @PostMapping("/sport")
    public Mono<String> getNearbySport(@RequestBody PlaceDto request) {
        return placesService.searchNearby(request, TypesLists.getSport());
    }

    @PostMapping("/busStop")
    public Mono<String> getNearbyBusStop(@RequestBody PlaceDto request) {
        return placesService.searchNearby(request, TypesLists.getBusStop());
    }

    @PostMapping("/info")
    public Mono<String> getPlaceInfo(@RequestBody String id) {
        return placesService.getPlaceInfo(id);
    }
}

