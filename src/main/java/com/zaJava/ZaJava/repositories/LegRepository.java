package com.zaJava.ZaJava.repositories;

import com.zaJava.ZaJava.model.Leg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LegRepository extends JpaRepository<Leg,Integer> {
    @Override
    Optional<Leg> findById(Integer myId);
}
