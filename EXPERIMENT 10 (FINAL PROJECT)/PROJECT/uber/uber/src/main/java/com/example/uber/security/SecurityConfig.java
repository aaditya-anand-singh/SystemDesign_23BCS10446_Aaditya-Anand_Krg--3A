package com.example.uber.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // ✅ VERY IMPORTANT (allow preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // public endpoints
                .requestMatchers("/users/login", "/users").permitAll()

                // everything else
                .anyRequest().permitAll()
            );

        return http.build();
    }
}