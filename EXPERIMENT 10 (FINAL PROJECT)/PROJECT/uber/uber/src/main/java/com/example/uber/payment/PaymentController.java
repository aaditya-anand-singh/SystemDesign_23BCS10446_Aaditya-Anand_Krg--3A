package com.example.uber.payment;

import com.example.uber.ride.Ride;
import com.example.uber.ride.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private RideRepository rideRepository;

    // ✅ PAY FOR RIDE (USER)
    @PostMapping("/{rideId}")
    public String payRide(@PathVariable Long rideId, HttpServletRequest request) {

        String role = (String) request.getAttribute("role");
        String email = (String) request.getAttribute("email");

        // ✅ Only USER can pay
        if (!"USER".equals(role)) {
            throw new RuntimeException("Only USER can pay");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // ✅ Security: user can only pay for THEIR ride
        if (ride.getUserEmail() == null || !ride.getUserEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to pay for this ride");
        }

        // ✅ Already paid check
        if ("PAID".equals(ride.getStatus())) {
            throw new RuntimeException("Ride already paid");
        }

        // ✅ Only COMPLETED rides can be paid
        if (!"COMPLETED".equals(ride.getStatus())) {
            throw new RuntimeException("Ride must be COMPLETED before payment");
        }

        // ✅ Mark as PAID
        ride.setStatus("PAID");

        rideRepository.save(ride);

        return "Payment successful";
    }
}