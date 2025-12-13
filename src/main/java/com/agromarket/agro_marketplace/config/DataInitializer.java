package com.agromarket.agro_marketplace.config;

import com.agromarket.agro_marketplace.entity.Roles;
import com.agromarket.agro_marketplace.entity.User;
import com.agromarket.agro_marketplace.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByEmail("admin@agro.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@agro.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .roles(Set.of(Roles.ADMIN))
                    .phone("0000000000")
                    .city("System")
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin@agro.com / admin123");
        }

        // Fix null revenue for existing users
        userRepository.findAll().forEach(user -> {
            if (user.getRevenue() == null) {
                user.setRevenue(BigDecimal.ZERO);
                userRepository.save(user);
            }
        });
    }
}
