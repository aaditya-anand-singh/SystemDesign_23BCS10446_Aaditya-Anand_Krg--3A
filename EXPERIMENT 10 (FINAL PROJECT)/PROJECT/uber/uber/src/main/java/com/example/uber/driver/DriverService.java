package com.example.uber.driver;

import com.example.uber.ride.Ride;
import com.example.uber.ride.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    @Autowired
    private RideRepository rideRepository;

    // ✅ Driver accepts ride
   public Ride acceptRide(Long rideId, String driverEmail) {

    // ❌ Check: driver already has active ride?
    List<Ride> activeRides = rideRepository.findByDriverEmail(driverEmail);

boolean hasActive = activeRides.stream()
        .anyMatch(r -> r.getStatus().equals("ACCEPTED"));

if (hasActive) {
    throw new RuntimeException("Driver already has an active ride");
}

    Ride ride = rideRepository.findById(rideId).orElse(null);

    if (ride == null) {
        throw new RuntimeException("Ride not found");
    }

    if (ride.getDriverEmail() != null) {
        throw new RuntimeException("Ride already taken");
    }

    ride.setDriverEmail(driverEmail);
    ride.setStatus("ACCEPTED");

    return rideRepository.save(ride);
}
    // ✅ Get available rides
    public List<Ride> getAvailableRides() {
        return rideRepository.findByDriverEmailIsNull();
    }

    // ✅ NEW: Driver ride history
    public List<Ride> getDriverRides(String driverEmail) {
        return rideRepository.findByDriverEmail(driverEmail);
    }
}