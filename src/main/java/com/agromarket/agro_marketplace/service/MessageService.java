package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.message.*;

import java.util.List;

public interface MessageService {
    MessageDTO send(SendMessageRequest req, String senderEmail);
    List<MessageDTO> inbox(String receiverEmail);
}
