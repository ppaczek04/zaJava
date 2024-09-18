package com.zaJava.ZaJava.model;

import lombok.Data;
import java.util.List;

@Data
public class ReverseGeocodingResponse {
    private List<Result> results;

    @Data
    public static class Result {
        private String formatted_address;
    }
}

