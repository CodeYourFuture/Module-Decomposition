package com.shaghayegh.chat_app.service;

import com.shaghayegh.chat_app.model.Message;
import com.shaghayegh.chat_app.model.User;
import com.shaghayegh.chat_app.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;

    public MessageService(
            MessageRepository messageRepository,
            UserService userService) {

        this.messageRepository = messageRepository;
        this.userService = userService;
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Message createMessage(Message message, String username) {

        User user = userService.findOrCreateUser(username);

        message.setUser(user);
        message.setCreatedAt(LocalDateTime.now());

        return messageRepository.save(message);
    }
}