package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Location;
import com.zaJava.ZaJava.model.Selections;
import com.zaJava.ZaJava.places.*;
import com.zaJava.ZaJava.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
public class MapController {

    private final MapService mapService;
    private final PlacesService placesService;
    private final PlacesMapper placesMapper;

    @Autowired
    public MapController(MapService mapService, PlacesService placesService) {
        this.mapService = mapService;
        this.placesService = placesService;
        this.placesMapper = new PlacesMapper();
    }

    @GetMapping(value = "/")
    public String getDefaultMap(Model model){
        model.addAttribute(new Location());
        model.addAttribute("selections", new Selections());
        return "index.html";
    }

    @PostMapping(value="/home")
    public String getMapForLocation(Location location, Model model){
        mapService.addCoordinates(location);
        model.addAttribute(location);
        model.addAttribute("selections", new Selections());
        model.addAttribute("points", new ArrayList<>());
        return "index.html";
    }

    @PostMapping(value="/processSelections")
    public Mono<String> processSelections(Selections selections, Model model) {
        model.addAttribute("selections", selections);
        // Tutaj będzie wczytana lokalizcja z bazy danych, czy też jakos inaczej. Tego pierwszego znacznika.
        PlaceDto place = new PlaceDto();
        place.setLatitude(50.08956767480298);
        place.setLongitude(19.929814497426612);
        place.setRadius(500);
        // ****************************

        String[] types = mapService.getPlacesTypes(selections);

        model.addAttribute(new Location("Kraków", 50.08956767480298, 19.929814497426612));

        return placesService.searchNearby(place, types)
                .map(result -> {
                    List<Point> points = placesMapper.parsePoints(result);
                    model.addAttribute("points", points);
                    return "index";
                });
    }
}

