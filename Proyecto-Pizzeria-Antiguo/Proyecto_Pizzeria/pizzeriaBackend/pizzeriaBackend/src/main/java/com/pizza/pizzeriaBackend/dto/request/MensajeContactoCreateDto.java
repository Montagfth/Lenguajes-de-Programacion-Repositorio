package com.pizza.pizzeriaBackend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record MensajeContactoCreateDto(
        @NotBlank String medio,
        @NotBlank String mensaje,
        @NotNull Long contactoId,
        Long localId
) {}