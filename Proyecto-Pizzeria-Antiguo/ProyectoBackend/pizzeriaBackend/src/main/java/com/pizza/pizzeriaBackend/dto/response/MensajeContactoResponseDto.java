package com.pizza.pizzeriaBackend.dto.response;


import java.time.LocalDateTime;


public record MensajeContactoResponseDto(
        Long id,
        String medio,
        String mensaje,
        LocalDateTime createdAt,
        Long contactoId,
        Long localId
) {}