package com.zaJava.ZaJava.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "route_tbl"
)
public class Route {
    @Id
    @GeneratedValue
//            (
//            strategy = GenerationType.TABLE,
//            generator = "route_id_gen"
//    )
//    @SequenceGenerator(
//            name= "route_sequence",
//            sequenceName = "route_sequence",
//            allocationSize = 1
//    )
//    @TableGenerator(
//            name = "route_id_gen",
//            table = "id_generator",
//            pkColumnName = "id_name",
//            valueColumnName = "id_value",
//            allocationSize = 1
//    )
    private Integer id;
    private int distance;
    private int time;

    @OneToMany(mappedBy = "route")
    private List<Leg> legs;

    @OneToMany(mappedBy = "route")
    private List<MapPoint> points;
}
