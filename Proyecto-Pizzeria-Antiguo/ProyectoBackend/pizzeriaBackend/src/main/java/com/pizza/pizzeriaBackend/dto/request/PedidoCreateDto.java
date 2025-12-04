package com.pizza.pizzeriaBackend.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public record PedidoCreateDto(
        @NotNull Long contactoId,
        @NotNull Long localId,
        LocalDateTime fechaPedido,
        BigDecimal total,
        String estado,
        String metodoPago,
        Boolean delivery,
        String direccionEnvio
) {}