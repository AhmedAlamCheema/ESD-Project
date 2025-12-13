package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.user.UserDTO;
import com.agromarket.agro_marketplace.entity.User;
import com.agromarket.agro_marketplace.repository.UserRepository;
import com.agromarket.agro_marketplace.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;

    public UserServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDTO me(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    @Override
    public List<UserDTO> listAll() {
        return userRepo.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public void delete(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepo.delete(user);
    }

    private UserDTO toDTO(User u) {
        return new UserDTO(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhone(),
                u.getCity(),
                u.getRoles() == null ? null : u.getRoles().stream().map(Enum::name).collect(Collectors.toSet()),
                u.getRevenue() != null ? u.getRevenue() : java.math.BigDecimal.ZERO
        );
    }
}
