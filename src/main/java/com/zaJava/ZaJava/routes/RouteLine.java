package com.zaJava.ZaJava.routes;

public class RouteLine {
    private double distance;
    private double time;
    private MapPoint startPoint;
    private MapPoint endPoint;


    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public double getTime() {
        return time;
    }

    public void setTime(double time) {
        this.time = time;
    }

    public MapPoint getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(MapPoint startPoint) {
        this.startPoint = startPoint;
    }

    public MapPoint getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(MapPoint endPoint) {
        this.endPoint = endPoint;
    }
}
