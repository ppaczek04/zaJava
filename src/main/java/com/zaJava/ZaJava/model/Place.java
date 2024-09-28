package com.zaJava.ZaJava.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "places", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"latitude", "longitude"})
})
public class Place {
    @Id
    @GeneratedValue
    private Integer id;
//    private String name;
    private double  latitude;
    private double longitude;


//    @OneToOne(mappedBy = "home")
//    private Route homeRoute;
//
//    @OneToOne(mappedBy = "destination")
//    private Route destinationRoute;
}
