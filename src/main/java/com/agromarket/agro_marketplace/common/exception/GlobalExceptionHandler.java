package com.agromarket.agro_marketplace.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fields = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fields.put(fe.getField(), fe.getDefaultMessage());
        }

        ApiError err = new ApiError(
                Instant.now(),
                400,
                "Validation failed",
                req.getRequestURI(),
                fields
        );
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex, HttpServletRequest req) {
        ApiError err = new ApiError(
                Instant.now(),
                400,
                ex.getMessage(),
                req.getRequestURI(),
                null
        );
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
        ex.printStackTrace(); // TEMP: show real cause in IntelliJ console

        ApiError err = new ApiError(
                Instant.now(),
                500,
                ex.getClass().getSimpleName() + ": " + ex.getMessage(), // TEMP: helpful
                req.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }

}
