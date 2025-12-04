package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.EventoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.EventoResponseDto;
import java.util.List;

public interface IEventoService {
    EventoResponseDto crearEvento(EventoCreateDto dto);
    List<EventoResponseDto> listarEventos();
    List<EventoResponseDto> listarPorLocal(Long localId);
    EventoResponseDto obtenerPorId(Long id);
    EventoResponseDto actualizar(Long id, EventoCreateDto dto);
    void eliminar(Long id);
}
