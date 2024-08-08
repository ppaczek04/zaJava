package com.zaJava.ZaJava.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {

    @GetMapping("/map")
    public String showMap() {
        return "map"; // nazwa pliku HTML w katalogu templates bez rozszerzenia
    }
}

