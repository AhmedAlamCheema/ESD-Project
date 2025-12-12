package com.agromarket.agro_marketplace.repository;

import com.agromarket.agro_marketplace.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiver_EmailOrderBySentAtDesc(String email);
}
