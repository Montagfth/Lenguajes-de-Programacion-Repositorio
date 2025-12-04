package com.pizza.pizzeriaBackend.dto.response;


import java.time.LocalDateTime;
import java.time.LocalTime;


public record LocalResponseDto(
        Long id,
        String nombre,
        String direccion,
        String ciudad,
        String telefono,
        String email,
        Integer capacidad,
        LocalTime horarioApertura,
        LocalTime horarioCierre,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}