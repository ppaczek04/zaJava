package com.zaJava.ZaJava.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "leg_tbl"
)
public class Leg {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(
            nullable = false
    )
    private String polyline;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @OneToMany(mappedBy = "leg")
    private List<MapPoint> points;

}
