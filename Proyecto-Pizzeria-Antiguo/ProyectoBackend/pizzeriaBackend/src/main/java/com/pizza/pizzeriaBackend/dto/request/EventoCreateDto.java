package com.pizza.pizzeriaBackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;


public record EventoCreateDto(
        @NotBlank String titulo,
        String descripcion,
        @NotNull LocalDateTime fechaInicio,
        @NotNull LocalDateTime fechaFin,
        Integer aforoMaximo,
        @NotNull Long localId
) {}