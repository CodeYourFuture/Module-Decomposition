package com.shaghayegh.chat_app.service;

import com.shaghayegh.chat_app.model.User;
import com.shaghayegh.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User findOrCreateUser(String username) {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User();
        newUser.setUsername(username);

        return userRepository.save(newUser);
    }
}