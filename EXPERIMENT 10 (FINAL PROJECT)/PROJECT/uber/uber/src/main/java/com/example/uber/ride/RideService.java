package com.example.uber.ride;

import com.example.uber.payment.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // ✅ Create ride (USER)
    public Ride createRide(Ride ride, String userEmail) {
        ride.setUserEmail(userEmail);
        ride.setStatus("CREATED");
        return rideRepository.save(ride);
    }

    // ✅ Get rides of user (pagination)
    public Page<Ride> getUserRides(String email, Pageable pageable) {
        return rideRepository.findByUserEmail(email, pageable);
    }

    // ⚠️ (Not used now, DriverService handles this)
    public Ride acceptRide(Long rideId, String driverEmail) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriverEmail() != null) {
            throw new RuntimeException("Ride already accepted");
        }

        ride.setDriverEmail(driverEmail);
        ride.setStatus("ACCEPTED");

        return rideRepository.save(ride);
    }

    // ✅ Complete ride
    public Ride completeRide(Long id, String driverEmail) {

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriverEmail() == null ||
            !ride.getDriverEmail().equals(driverEmail)) {
            throw new RuntimeException("You are not assigned to this ride");
        }

        if (!"ACCEPTED".equals(ride.getStatus())) {
            throw new RuntimeException("Ride is not in ACCEPTED state");
        }

        ride.setStatus("COMPLETED");

        return rideRepository.save(ride);
    }

    // ✅ NEW: ADMIN → get all rides
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}