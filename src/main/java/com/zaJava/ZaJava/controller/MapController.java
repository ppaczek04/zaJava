package com.zaJava.ZaJava.controller;

import com.zaJava.ZaJava.model.Location;
import com.zaJava.ZaJava.model.Selections;
import com.zaJava.ZaJava.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MapController {

    private final MapService mapService;
    @Autowired
    public MapController(MapService mapService) {
        this.mapService = mapService;
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
        return "index.html";
    }
    @PostMapping(value="/processSelections")
    public String processSelections(Selections selections, Model model) {
        model.addAttribute("selections", selections);
        return "redirect:/";
    }
}

