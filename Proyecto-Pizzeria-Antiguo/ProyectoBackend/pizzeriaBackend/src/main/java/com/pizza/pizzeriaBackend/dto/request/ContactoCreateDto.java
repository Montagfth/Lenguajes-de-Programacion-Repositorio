package com.pizza.pizzeriaBackend.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record ContactoCreateDto(
        @NotBlank
        String nombre,

        @Email
        String email,

        @Size(max = 20)
        String telefono
) {}