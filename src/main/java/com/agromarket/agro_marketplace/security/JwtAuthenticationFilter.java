package com.agromarket.agro_marketplace.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        try {
            if (auth != null && auth.startsWith("Bearer ")) {
                String token = auth.substring(7);

                // if token is empty -> just continue
                if (!token.isBlank()) {
                    String email = jwtService.extractSubject(token);

                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        var userDetails = userDetailsService.loadUserByUsername(email);
                        var authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (Exception ignored) {
            // IMPORTANT: don't crash the request (Swagger docs, etc.) if token is invalid
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }

}
