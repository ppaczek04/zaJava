package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route,Integer> {
    @Query("SELECT r FROM Route r WHERE r.journey.title = :title")
    List<Route> findRoutesByJourneyTitle(@Param("title") String title);

    @Query("SELECT r.polyline FROM Route r WHERE r.journey.title = :title")
    List<String> findPolylinesByJourneyTitle(@Param("title") String title);
}
