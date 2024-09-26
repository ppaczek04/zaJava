package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place,Integer> {
//    List<Place> findByRoute_Id(Integer routeId);
}


