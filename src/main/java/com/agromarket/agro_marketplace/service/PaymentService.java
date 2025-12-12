package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.payment.*;

public interface PaymentService {
    PaymentDTO pay(CreatePaymentRequest req, String buyerEmail, boolean isAdmin);
    PaymentDTO getByOrderId(Long orderId, String requesterEmail, boolean isAdmin);
}
