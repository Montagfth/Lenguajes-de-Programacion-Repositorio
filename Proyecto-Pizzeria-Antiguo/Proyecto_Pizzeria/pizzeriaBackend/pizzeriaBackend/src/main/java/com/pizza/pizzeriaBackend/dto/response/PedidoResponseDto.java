package com.pizza.pizzeriaBackend.dto.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;


public record PedidoResponseDto(
        Long id,
        LocalDateTime fechaPedido,
        BigDecimal total,
        String estado,
        String metodoPago,
        Boolean delivery,
        String direccionEnvio,
        Long localId,
        Long contactoId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}