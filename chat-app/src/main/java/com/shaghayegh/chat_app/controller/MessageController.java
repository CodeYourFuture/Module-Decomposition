package com.shaghayegh.chat_app.controller;

import com.shaghayegh.chat_app.model.Message;
import com.shaghayegh.chat_app.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@CrossOrigin(origins= "http://localhost:63342")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/messages")
    public List<Message> getMessages() {
        return messageService.getAllMessages();
    }


    @PostMapping("/messages")
    public Message createMessage(
            @Valid @RequestBody Message message,
            @RequestParam String username) {

        return messageService.createMessage(message, username);
    }
}