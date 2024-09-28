package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.Place;
import com.zaJava.ZaJava.model.Point;
import com.zaJava.ZaJava.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place,Integer> {
//    List<Place> findByRoute_Id(Integer routeId);
    Optional<Place> findByLatitudeAndLongitude(Double latitude, Double longitude);

    @Query("SELECT p FROM Place p WHERE p.id IN (SELECT r.home.id FROM Route r WHERE r IN :routes) OR p.id IN (SELECT r.destination.id FROM Route r WHERE r IN :routes)")
    List<Place> findPlacesByRoutes(@Param("routes") List<Route> routes);

    @Query("SELECT p FROM Place p WHERE p.id IN (SELECT r.home.id FROM Route r WHERE r.journey.title = :title) OR p.id IN (SELECT r.destination.id FROM Route r WHERE r.journey.title = :title)")
    List<Place> findPlacesByJourneyTitle(@Param("title") String title);
}


