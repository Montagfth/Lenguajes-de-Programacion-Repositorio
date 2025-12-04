package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.ReservaCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ReservaResponseDto;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.Reserva;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ReservaMapper {

    public Reserva toEntity(ReservaCreateDto dto) {
        return Reserva.builder()
                .datetimeReserva(dto.datetimeReserva())
                .cantidadPersonas(dto.cantidadPersonas())
                .notas(dto.notas())
                .estado(Reserva.EstadoReserva.PENDIENTE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public ReservaResponseDto toResponse(Reserva entity) {
        return new ReservaResponseDto(
                entity.getId(),
                entity.getDatetimeReserva(),
                entity.getCantidadPersonas(),
                entity.getEstado().name(),
                entity.getNotas(),
                entity.getLocal().getId(),
                entity.getContacto().getId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
