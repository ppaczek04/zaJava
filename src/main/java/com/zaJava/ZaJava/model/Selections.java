package com.zaJava.ZaJava.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class Selections {
    private boolean foodAndDrink;
    private boolean culture;
    private boolean entertainmentAndRecreation;
    private boolean sport;
    private boolean busStop;
}