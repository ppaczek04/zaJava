package com.zaJava.ZaJava.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "route_details"
)
public class RouteDetails {
    @Id
    @GeneratedValue
    private Integer id;
    private String distance;
    private String time;

    @OneToOne
    @JoinColumn(name = "route_id")
    @JsonBackReference
    private Route route;
}
