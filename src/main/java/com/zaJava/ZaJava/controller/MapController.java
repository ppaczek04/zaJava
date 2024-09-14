package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Location;
import com.zaJava.ZaJava.model.ProcessSelectionsRequest;
import com.zaJava.ZaJava.model.Selections;
import com.zaJava.ZaJava.places.*;
import com.zaJava.ZaJava.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Arrays;
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

    @PostMapping(value = "/processSelections")
    @ResponseBody
    public List<Point> processSelections(@RequestBody ProcessSelectionsRequest request) {
        System.out.println(request.getSelections().toString() + "\n");

        String[] types = mapService.getPlacesTypes(request.getSelections());
        System.out.print(request.getPlace().getRadius() + " " + request.getPlace().getLatitude() + " " + request.getPlace().getLongitude() + "\n");
        System.out.print(Arrays.toString(types));

        return placesService.searchNearby(request.getPlace(), types)
                .map(placesMapper::parsePoints)
                .block();
    }
}
