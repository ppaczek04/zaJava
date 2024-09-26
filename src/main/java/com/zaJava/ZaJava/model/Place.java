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
        name = "places"
)
public class Place {
    @Id
    @GeneratedValue
    private Integer id;
//    private String name;
    private double  latitude;
    private double longitude;


    @OneToOne(mappedBy = "home")
    private Route homeRoute;

    @OneToOne(mappedBy = "destination")
    private Route destinationRoute;
}
