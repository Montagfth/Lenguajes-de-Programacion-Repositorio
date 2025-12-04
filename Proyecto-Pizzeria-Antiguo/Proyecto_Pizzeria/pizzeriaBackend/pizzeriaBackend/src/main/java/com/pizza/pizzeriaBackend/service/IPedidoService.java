package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.PedidoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.PedidoResponseDto;
import java.util.List;

public interface IPedidoService {
    PedidoResponseDto crearPedido(PedidoCreateDto dto);
    List<PedidoResponseDto> listarPedidos();
    List<PedidoResponseDto> listarPorContacto(Long contactoId);
    PedidoResponseDto obtenerPorId(Long id);
    PedidoResponseDto actualizarEstado(Long id, String nuevoEstado);
    void eliminar(Long id);
}