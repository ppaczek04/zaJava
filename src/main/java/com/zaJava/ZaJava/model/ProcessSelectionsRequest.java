package com.zaJava.ZaJava.model;

import com.zaJava.ZaJava.places.PlaceDto;
import lombok.Data;

@Data
public class ProcessSelectionsRequest {
    private Selections selections;
    private PlaceDto place;
}
