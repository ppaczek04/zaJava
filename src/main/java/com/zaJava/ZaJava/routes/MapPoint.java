package com.zaJava.ZaJava.routes;

public class MapPoint {
    private String nameOfPlace;
    private double  latitude;
    private double longtiude;

    public MapPoint(String nameOfPlace, double latitude, double longtiude){
        this.nameOfPlace = nameOfPlace;
        this.latitude = latitude;
        this.longtiude = longtiude;
    }
    public String Raport(){
        return nameOfPlace + " : " + latitude + ", " + longtiude + ".";
    }


    public double getLatitude(){
        return latitude;
    }
    public void setLatitude(double latitude){
        this.latitude = latitude;
    }
    public double getLongtude(){
        return longtiude;
    }
    public void setLongtude(double longitude){
        this.longtiude = longitude;
    }
}
