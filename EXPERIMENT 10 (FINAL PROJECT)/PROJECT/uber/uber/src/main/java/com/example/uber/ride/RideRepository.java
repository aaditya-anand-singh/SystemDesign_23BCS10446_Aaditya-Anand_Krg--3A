package com.example.uber.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface RideRepository extends JpaRepository<Ride, Long> {

    // get rides by user
    List<Ride> findByUserEmail(String userEmail);

    // get rides by driver
    List<Ride> findByDriverEmail(String driverEmail);

    List<Ride> findByDriverEmailIsNull();

    Page<Ride> findByUserEmail(String userEmail, Pageable pageable);

    List<Ride> findByDriverEmailAndStatus(String email, String status);
}