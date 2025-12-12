package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.auth.*;

public interface AuthService {
    void register(RegisterRequest req);
    LoginResponse login(LoginRequest req);
}
