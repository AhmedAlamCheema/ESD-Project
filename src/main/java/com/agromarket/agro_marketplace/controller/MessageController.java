package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.message.*;
import com.agromarket.agro_marketplace.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) { this.messageService = messageService; }

    @PostMapping
    public ResponseEntity<MessageDTO> send(@Valid @RequestBody SendMessageRequest req, Authentication auth) {
        return ResponseEntity.ok(messageService.send(req, auth.getName()));
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<MessageDTO>> inbox(Authentication auth) {
        return ResponseEntity.ok(messageService.inbox(auth.getName()));
    }
}
