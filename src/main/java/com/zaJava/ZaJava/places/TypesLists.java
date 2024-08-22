package com.zaJava.ZaJava.places;

import org.springframework.stereotype.Service;

@Service
public class TypesLists {

    String[] getEntertainmentAndRecreation(){
        return new String[] {"amusement_center",
                "amusement_park",
                "aquarium",
                "banquet_hall",
                "bowling_alley",
                "casino",
                "community_center",
                "convention_center",
                "cultural_center",
                "dog_park",
                "event_venue",
                "hiking_area",
                "historical_landmark",
                "marina",
                "movie_rental",
                "movie_theater",
                "national_park",
                "night_club",
                "park",
                "tourist_attraction",
                "visitor_center",
                "wedding_venue",
                "zoo"};
    }

    public String[] getFoodAndDrink(){
        return new String[] {"american_restaurant",
                "bakery",
                "bar",
                "barbecue_restaurant",
                "brazilian_restaurant",
                "breakfast_restaurant",
                "brunch_restaurant",
                "cafe",
                "chinese_restaurant",
                "coffee_shop",
                "fast_food_restaurant",
                "french_restaurant",
                "greek_restaurant",
                "hamburger_restaurant",
                "ice_cream_shop",
                "indian_restaurant",
                "indonesian_restaurant",
                "italian_restaurant",
                "japanese_restaurant",
                "korean_restaurant",
                "lebanese_restaurant",
                "meal_delivery",
                "meal_takeaway",
                "mediterranean_restaurant",
                "mexican_restaurant",
                "middle_eastern_restaurant",
                "pizza_restaurant",
                "ramen_restaurant",
                "restaurant",
                "sandwich_shop",
                "seafood_restaurant",
                "spanish_restaurant",
                "steak_house",
                "sushi_restaurant",
                "thai_restaurant",
                "turkish_restaurant",
                "vegan_restaurant",
                "vegetarian_restaurant",
                "vietnamese_restaurant"};
    }

    String[] getCulture(){
        return new String[] {"art_gallery",
                "museum",
                "performing_arts_theater"};
    }

    String[] getSport(){
        return new String[] {"athletic_field",
                "fitness_center",
                "golf_course",
                "gym",
                "playground",
                "ski_resort",
                "sports_club",
                "sports_complex",
                "stadium",
                "swimming_pool"};
    }

    String[] getBusStop(){
        return new String[] {"bus_station",
                "bus_stop"};
    }
}
