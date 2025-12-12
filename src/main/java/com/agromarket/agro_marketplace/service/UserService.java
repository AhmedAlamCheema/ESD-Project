package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.entity.User;

import java.util.List;

public interface UserService {
    User me(String email);
    List<User> listAll(); // admin only
}
