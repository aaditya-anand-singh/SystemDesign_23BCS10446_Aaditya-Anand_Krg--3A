package com.example.uber.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    // ✅ Save user (ENCRYPT PASSWORD)
     private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User saveUser(User user) {
        // 🔥 encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ Update user (also encrypt password if changed)
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());

            // 🔥 important: encrypt new password
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));

            user.setPhone(updatedUser.getPhone());
            user.setRole(updatedUser.getRole());

            return userRepository.save(user);
        }

        return null;
    }

    // ✅ Login (compare encrypted password)
    public User login(String email, String password) {

    User user = userRepository.findByEmail(email);

    if (user == null) {
        throw new RuntimeException("User not found");
    }

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid email or password");
    }

    return user;
}
}