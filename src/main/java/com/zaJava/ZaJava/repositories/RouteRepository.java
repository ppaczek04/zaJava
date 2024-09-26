package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route,Integer> {
    @Override
    Optional<Route> findById(Integer myId);
}
