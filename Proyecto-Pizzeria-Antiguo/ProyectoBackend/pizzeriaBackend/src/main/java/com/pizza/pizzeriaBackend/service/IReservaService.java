package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.ReservaCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ReservaResponseDto;
import java.util.List;

public interface IReservaService {
    ReservaResponseDto crearReserva(ReservaCreateDto dto);
    List<ReservaResponseDto> listarReservas();
    List<ReservaResponseDto> listarPorContacto(Long contactoId);
    ReservaResponseDto obtenerPorId(Long id);
    ReservaResponseDto actualizarEstado(Long id, String nuevoEstado);
    void eliminar(Long id);
}