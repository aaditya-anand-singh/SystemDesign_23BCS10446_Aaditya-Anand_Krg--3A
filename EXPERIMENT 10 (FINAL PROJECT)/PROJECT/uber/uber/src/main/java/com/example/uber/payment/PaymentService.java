package com.example.uber.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // ✅ Make payment (simple simulation)
    public Payment makePayment(Long rideId, double amount) {

        Payment payment = new Payment();

        payment.setRideId(rideId);
        payment.setAmount(amount);
        payment.setStatus("SUCCESS"); // simulate success

        return paymentRepository.save(payment);
    }
}