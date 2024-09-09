package com.zaJava.ZaJava.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "point_tbl"
)
public class MapPoint {
    @Id
    @GeneratedValue
    private Integer id;
    private String nameOfPlace;
    private double  latitude;
    private double longitude;

    @ManyToOne
    @JoinColumn(name = "leg_id")
    private Leg leg;

    @ManyToOne
    @JoinColumn(name = "pointsToRoute_id")
    private Route route;
}
