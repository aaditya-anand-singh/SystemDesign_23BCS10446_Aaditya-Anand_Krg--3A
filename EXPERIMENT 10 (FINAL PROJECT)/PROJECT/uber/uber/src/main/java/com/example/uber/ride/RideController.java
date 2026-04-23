package com.example.uber.ride;

import com.example.uber.driver.DriverService;
import com.example.uber.ride.dto.RideResponse;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rides")
@CrossOrigin(origins = "http://localhost:5173")
public class RideController {

    @Autowired
    private RideService rideService;

    @Autowired
    private DriverService driverService;

    // ✅ Create ride
    @PostMapping
    public Ride createRide(@RequestBody Ride ride, HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        return rideService.createRide(ride, email);
    }

    // ✅ User rides
    @GetMapping
    public List<RideResponse> getMyRides(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        String email = (String) request.getAttribute("email");

        Page<Ride> ridePage = rideService.getUserRides(email, PageRequest.of(page, size));

        return ridePage.getContent()
                .stream()
                .map(r -> new RideResponse(
                        r.getId(),
                        r.getPickupLocation(),
                        r.getDropLocation(),
                        r.getStatus()
                ))
                .toList();
    }

    // ✅ Available rides
    @GetMapping("/available")
    public List<Ride> getAvailableRides(HttpServletRequest request) {

        if (!"DRIVER".equals(request.getAttribute("role"))) {
            throw new RuntimeException("Only DRIVER can view available rides");
        }

        return driverService.getAvailableRides();
    }

    // ✅ Driver rides
    @GetMapping("/driver")
    public List<Ride> getDriverRides(HttpServletRequest request) {

        if (!"DRIVER".equals(request.getAttribute("role"))) {
            throw new RuntimeException("Only DRIVER can view their rides");
        }

        String email = (String) request.getAttribute("email");

        return driverService.getDriverRides(email);
    }

    // ✅ Accept ride
    @PutMapping("/accept/{id}")
    public Ride acceptRide(@PathVariable Long id, HttpServletRequest request) {

        if (!"DRIVER".equals(request.getAttribute("role"))) {
            throw new RuntimeException("Only DRIVER can accept rides");
        }

        String driverEmail = (String) request.getAttribute("email");

        return driverService.acceptRide(id, driverEmail);
    }

    // ✅ Complete ride
    @PutMapping("/complete/{id}")
    public Ride completeRide(@PathVariable Long id, HttpServletRequest request) {

        if (!"DRIVER".equals(request.getAttribute("role"))) {
            throw new RuntimeException("Only DRIVER can complete rides");
        }

        String email = (String) request.getAttribute("email");

        return rideService.completeRide(id, email);
    }

    // ✅ ADMIN → All rides
    @GetMapping("/all")
    public List<Ride> getAllRides(HttpServletRequest request) {

        if (!"ADMIN".equals(request.getAttribute("role"))) {
            throw new RuntimeException("Only ADMIN can view all rides");
        }

        return rideService.getAllRides();
    }
}