package com.zaJava.ZaJava.service;


import com.zaJava.ZaJava.model.GeocodingResponse;
import com.zaJava.ZaJava.model.Location;
import com.zaJava.ZaJava.model.Selections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;

@Service
public class MapService {
    @Value("${google.api.key}")
    private String apiKey;

    public void addCoordinates( Location location){
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                location.getCity()+ "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        GeocodingResponse response = restTemplate.getForObject(url, GeocodingResponse.class);
        if (response != null && !response.getResults().isEmpty()) {
            Location coordinates = response.getResults().get(0).getGeometry().getLocation();
            location.setLat(coordinates.getLat());
            location.setLng(coordinates.getLng());
        } else {
            System.out.println("No results found for the provided address.");
        }
    }

    public String[] getPlacesTypes(Selections selections){
        ArrayList<String> types = new ArrayList<>();

        if(selections.isFoodAndDrink()){
            types.addAll(Arrays.asList(TypesLists.getFoodAndDrink()));
        }
        if(selections.isCulture()){
            types.addAll(Arrays.asList(TypesLists.getCulture()));
        }
        if(selections.isEntertainmentAndRecreation()){
            types.addAll(Arrays.asList(TypesLists.getEntertainmentAndRecreation()));
        }
        if(selections.isSport()){
            types.addAll(Arrays.asList(TypesLists.getSport()));
        }
        if(selections.isBusStop()){
            types.addAll(Arrays.asList(TypesLists.getBusStop()));
        }

        return types.toArray(new String[0]);
    }
}
