package com.agromarket.agro_marketplace.controller;

import com.agromarket.agro_marketplace.dto.user.UserDTO;
import com.agromarket.agro_marketplace.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication auth) {
        return ResponseEntity.ok(userService.me(auth.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDTO>> listAll() {
        return ResponseEntity.ok(userService.listAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
