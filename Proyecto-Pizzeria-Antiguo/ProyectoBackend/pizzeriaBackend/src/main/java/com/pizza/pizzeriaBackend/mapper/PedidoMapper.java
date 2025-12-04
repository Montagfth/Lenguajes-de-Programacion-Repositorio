package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.PedidoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.PedidoResponseDto;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.Pedido;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PedidoMapper {

    public Pedido toEntity(PedidoCreateDto dto) {

        return Pedido.builder()
                .fechaPedido(dto.fechaPedido() != null ? dto.fechaPedido() : LocalDateTime.now())
                .total(dto.total())
                .estado(dto.estado() != null ? Pedido.EstadoPedido.valueOf(dto.estado()) : Pedido.EstadoPedido.PENDIENTE)
                .metodoPago(dto.metodoPago() != null ? Pedido.MetodoPago.valueOf(dto.metodoPago()) : Pedido.MetodoPago.EFECTIVO)
                .delivery(Boolean.TRUE.equals(dto.delivery()))
                .direccionEnvio(dto.direccionEnvio())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public PedidoResponseDto toResponse(Pedido entity) {
        if (entity == null) return null;
        return new PedidoResponseDto(
                entity.getId(),
                entity.getFechaPedido(),
                entity.getTotal(),
                entity.getEstado().name(),
                entity.getMetodoPago().name(),
                entity.isDelivery(),
                entity.getDireccionEnvio(),
                entity.getLocal().getId(),
                entity.getContacto().getId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}