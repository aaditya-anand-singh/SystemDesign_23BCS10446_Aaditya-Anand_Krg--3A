package com.example.uber.ride.dto;

public class RideResponse {

    private Long id;
    private String pickupLocation;
    private String dropLocation;
    private String status;

    public RideResponse(Long id, String pickupLocation, String dropLocation, String status) {
        this.id = id;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getPickupLocation() { return pickupLocation; }
    public String getDropLocation() { return dropLocation; }
    public String getStatus() { return status; }
}