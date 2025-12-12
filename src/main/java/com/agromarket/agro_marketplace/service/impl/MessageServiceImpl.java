package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.message.*;
import com.agromarket.agro_marketplace.entity.Message;
import com.agromarket.agro_marketplace.entity.User;
import com.agromarket.agro_marketplace.repository.MessageRepository;
import com.agromarket.agro_marketplace.repository.UserRepository;
import com.agromarket.agro_marketplace.service.MessageService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;

    public MessageServiceImpl(MessageRepository messageRepo, UserRepository userRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
    }

    @Override
    public MessageDTO send(SendMessageRequest req, String senderEmail) {
        User sender = userRepo.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepo.findById(req.receiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message saved = messageRepo.save(Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(req.content())
                .sentAt(Instant.now())
                .build());

        return toDTO(saved);
    }

    @Override
    public List<MessageDTO> inbox(String receiverEmail) {
        return messageRepo.findByReceiver_EmailOrderBySentAtDesc(receiverEmail)
                .stream().map(this::toDTO).toList();
    }

    private MessageDTO toDTO(Message m) {
        return new MessageDTO(
                m.getId(),
                m.getSender().getEmail(),
                m.getReceiver().getEmail(),
                m.getContent(),
                m.getSentAt()
        );
    }
}
