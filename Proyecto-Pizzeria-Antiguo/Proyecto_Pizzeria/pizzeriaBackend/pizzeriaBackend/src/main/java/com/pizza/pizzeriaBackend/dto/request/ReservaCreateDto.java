package com.pizza.pizzeriaBackend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;


public record ReservaCreateDto(
        @NotNull Long contactoId,
        @NotNull Long localId,
        @NotNull LocalDateTime datetimeReserva,
        @NotNull @Min(1) Integer cantidadPersonas,
        String notas
) {}