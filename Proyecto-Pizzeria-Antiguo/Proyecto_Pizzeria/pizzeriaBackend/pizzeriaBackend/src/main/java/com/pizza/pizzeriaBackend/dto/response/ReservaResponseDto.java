package com.pizza.pizzeriaBackend.dto.response;


import java.time.LocalDateTime;


public record ReservaResponseDto(
        Long id,
        LocalDateTime datetimeReserva,
        Integer cantidadPersonas,
        String estado,
        String notas,
        Long localId,
        Long contactoId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}