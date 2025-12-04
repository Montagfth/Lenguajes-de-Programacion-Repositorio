package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.EventoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.EventoResponseDto;
import com.pizza.pizzeriaBackend.model.Evento;
import com.pizza.pizzeriaBackend.model.Local;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EventoMapper {

    public Evento toEntity(EventoCreateDto dto) {
        return Evento.builder()
                .titulo(dto.titulo())
                .descripcion(dto.descripcion())
                .fechaInicio(dto.fechaInicio())
                .fechaFin(dto.fechaFin())
                .aforoMaximo(dto.aforoMaximo())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public EventoResponseDto toResponse(Evento entity) {
        if (entity == null) return null;
        return new EventoResponseDto(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescripcion(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getAforoMaximo(),
                entity.getEstado().name(),
                entity.getLocal().getId(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
