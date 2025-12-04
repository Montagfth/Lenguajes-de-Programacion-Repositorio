package com.pizza.pizzeriaBackend.dto.response;


import java.time.LocalDateTime;


public record ContactoResponseDto(
        Long id,
        String nombre,
        String email,
        String telefono,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}