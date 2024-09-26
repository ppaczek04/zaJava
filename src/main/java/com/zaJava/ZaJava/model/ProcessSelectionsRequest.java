package com.zaJava.ZaJava.model;

import lombok.Data;

@Data
public class ProcessSelectionsRequest {
    private Selections selections;
    private PlaceDto place;
}
