package com.BooksBazaat.BooksBazaar.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.BooksBazaat.BooksBazaar.DTO.UserDTO;
import com.BooksBazaat.BooksBazaar.Entity.User;
import com.BooksBazaat.BooksBazaar.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public String registerUser(UserDTO dto) {
        if (userRepo.findByUsernameOrEmail(dto.getUsername(), dto.getEmail()).isPresent()) {
            return "User already exists!";
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // NOTE: In real apps, hash the password!

        userRepo.save(user);
        return "User registered successfully!";
    }

    public String login(UserDTO dto) {
        Optional<User> userOpt = userRepo.findByUsernameOrEmail(dto.getUsername(), dto.getUsername());

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(dto.getPassword())) {
            return "Login successful!";
        }

        return "Invalid username or password";
    }
}
