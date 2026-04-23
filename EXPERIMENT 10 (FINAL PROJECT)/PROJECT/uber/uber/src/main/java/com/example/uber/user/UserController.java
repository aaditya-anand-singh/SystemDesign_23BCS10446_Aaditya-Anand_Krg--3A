package com.example.uber.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.uber.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173") // ✅ ADD THIS
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Create user (PUBLIC)
    @PostMapping
public User createUser(@RequestBody User user) {

    // ✅ allow only USER or DRIVER
    if (!"USER".equals(user.getRole()) && !"DRIVER".equals(user.getRole())) {
        throw new RuntimeException("Only USER or DRIVER registration allowed");
    }

    return userService.saveUser(user);
}

    // ✅ Get all users (ADMIN only)
    @GetMapping
    public List<User> getUsers(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied: ADMIN only");
        }

        return userService.getAllUsers();
    }

    // ✅ Get own profile
    @GetMapping("/me")
    public User getMyProfile(HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        return userService.getUserByEmail(email);
    }

    // ✅ Get user by email (ADMIN only)
    @GetMapping("/email")
    public User getUserByEmail(@RequestParam String email, HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied: ADMIN only");
        }

        return userService.getUserByEmail(email);
    }

    // ✅ DELETE (ADMIN only)
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id, HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied: Only ADMIN can delete users");
        }

        userService.deleteUser(id);
        return "User deleted successfully";
    }

    // ✅ UPDATE (ADMIN only)
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user, HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access denied: ADMIN only");
        }

        return userService.updateUser(id, user);
    }

    // ✅ LOGIN (returns JSON)
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {

        User existingUser = userService.login(user.getEmail(), user.getPassword());

        String token = JwtUtil.generateToken(
                existingUser.getEmail(),
                existingUser.getRole()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return response;
    }
}