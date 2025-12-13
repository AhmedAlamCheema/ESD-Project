package com.agromarket.agro_marketplace.service;

import com.agromarket.agro_marketplace.dto.user.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO me(String email);
    List<UserDTO> listAll(); // admin only
    void delete(Long id); // admin only
}
