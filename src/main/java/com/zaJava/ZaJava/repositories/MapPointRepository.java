package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.MapPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MapPointRepository extends JpaRepository<MapPoint,Integer> {
    List<MapPoint> findByRoute_Id(Integer routeId);
}


