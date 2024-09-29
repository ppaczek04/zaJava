package com.zaJava.ZaJava.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "routes"
)
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(
            nullable = false,
            length = 10000
    )
    private String polyline;
    private Integer numberInJourney;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "home_id")
    private Place home;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id")
    private Place destination;

    @ManyToOne
    @JoinColumn(name = "journey_id")
    @JsonBackReference
    private Journey journey;

    @OneToOne(mappedBy = "route", cascade = CascadeType.ALL)
    @JsonManagedReference
    private RouteDetails details;
}
