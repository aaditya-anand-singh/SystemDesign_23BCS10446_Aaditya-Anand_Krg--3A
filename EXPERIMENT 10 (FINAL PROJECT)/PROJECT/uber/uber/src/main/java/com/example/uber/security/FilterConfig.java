package com.example.uber.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilter() {
        FilterRegistrationBean<JwtFilter> registration = new FilterRegistrationBean<>();

        registration.setFilter(new JwtFilter());

        registration.addUrlPatterns("/*");

        return registration;
    }
}