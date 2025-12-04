package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.LocalCreateDto;
import com.pizza.pizzeriaBackend.dto.response.LocalResponseDto;
import java.util.List;

public interface ILocalService {
    LocalResponseDto crearLocal(LocalCreateDto dto);
    List<LocalResponseDto> listarLocales();
    LocalResponseDto obtenerPorId(Long id);
    LocalResponseDto actualizar(Long id, LocalCreateDto dto);
    void eliminar(Long id);
}