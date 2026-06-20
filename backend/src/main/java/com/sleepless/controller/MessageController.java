package com.sleepless.controller;

import com.sleepless.model.Message;
import com.sleepless.repository.MessageRepository;
import com.sleepless.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public ResponseEntity<?> submitMessage(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody Message messageInput) {

        Message message = new Message(
                userPrincipal.getId(),
                messageInput.getName(),
                messageInput.getEmail(),
                messageInput.getNumber(),
                messageInput.getMessage()
        );

        messageRepository.save(message);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Message sent successfully!");
        return ResponseEntity.ok(response);
    }
}
