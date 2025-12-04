package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.MensajeContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.MensajeContactoResponseDto;
import java.util.List;

public interface IMensajeContactoService {
    MensajeContactoResponseDto crearMensaje(MensajeContactoCreateDto dto);
    List<MensajeContactoResponseDto> listarMensajes();
    List<MensajeContactoResponseDto> listarPorContacto(Long contactoId);
    MensajeContactoResponseDto obtenerPorId(Long id);
    void eliminar(Long id);
}
