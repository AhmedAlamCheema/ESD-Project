package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.entity.User;
import com.agromarket.agro_marketplace.repository.UserRepository;
import com.agromarket.agro_marketplace.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;

    public UserServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public User me(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> listAll() {
        return userRepo.findAll();
    }
}
