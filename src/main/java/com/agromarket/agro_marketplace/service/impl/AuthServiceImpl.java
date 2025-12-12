package com.agromarket.agro_marketplace.service.impl;

import com.agromarket.agro_marketplace.dto.auth.*;
import com.agromarket.agro_marketplace.entity.Roles;
import com.agromarket.agro_marketplace.entity.User;
import com.agromarket.agro_marketplace.repository.UserRepository;
import com.agromarket.agro_marketplace.security.JwtService;
import com.agromarket.agro_marketplace.service.AuthService;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email()))
            throw new RuntimeException("Email already registered");

        Set<Roles> roles = (req.roles() == null || req.roles().isEmpty())
                ? Set.of(Roles.BUYER)
                : req.roles();

        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .roles(roles)
                .phone(req.phone())
                .city(req.city())
                .build();

        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        String token = jwtService.generateToken(req.email());
        return new LoginResponse(token);
    }
}
