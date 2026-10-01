package com.shaghayegh.chat_app.controller;

import com.shaghayegh.chat_app.model.User;
import com.shaghayegh.chat_app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins="http://localhost:63342")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user){
       return  userService.createUser(user);

    }
}
