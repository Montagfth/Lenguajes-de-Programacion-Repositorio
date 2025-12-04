package com.pizza.pizzeriaBackend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;


public record LocalCreateDto(
        @NotBlank
        String nombre,
        String direccion,
        String ciudad,
        String telefono,
        String email,

        @NotNull
        Integer capacidad,
        LocalTime horarioApertura,
        LocalTime horarioCierre,
        Boolean activo
) {}