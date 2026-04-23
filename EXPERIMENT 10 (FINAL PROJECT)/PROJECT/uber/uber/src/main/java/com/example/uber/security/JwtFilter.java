package com.example.uber.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getServletPath();
        String method = req.getMethod();

        // ✅ VERY IMPORTANT: allow preflight request
        if ("OPTIONS".equalsIgnoreCase(method)) {
            res.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
            return;
        }

        // ✅ PUBLIC APIs
        if (method.equals("POST") && path.startsWith("/users")) {
            chain.doFilter(request, response);
            return;
        }

        if (path.startsWith("/users/login")) {
            chain.doFilter(request, response);
            return;
        }

        // ❌ CHECK TOKEN
        String header = req.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            res.sendError(401, "Missing or invalid token");
            return;
        }

        String token = header.substring(7);

        String email;
        String role;

        try {
            email = JwtUtil.extractEmail(token);
            role = JwtUtil.extractRole(token);
        } catch (Exception e) {
            res.sendError(401, "Invalid token");
            return;
        }

        // ✅ STORE DATA
        req.setAttribute("email", email);
        req.setAttribute("role", role);

        // 🔥 ONLY ADMIN can view all users
        if (method.equals("GET") && path.matches("^/users/?$") && !"ADMIN".equals(role)) {
            res.sendError(403, "Only ADMIN can view all users");
            return;
        }

        // 🔥 ONLY ADMIN can DELETE
        if (method.equals("DELETE") && !"ADMIN".equals(role)) {
            res.sendError(403, "Access denied: ADMIN only");
            return;
        }

        // ✅ CONTINUE
        chain.doFilter(request, response);
    }
}