package com.pizza.pizzeriaBackend.dto.response;

import java.time.LocalDateTime;


public record EventoResponseDto(
        Long id,
        String titulo,
        String descripcion,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Integer aforoMaximo,
        String estado,
        Long localId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}