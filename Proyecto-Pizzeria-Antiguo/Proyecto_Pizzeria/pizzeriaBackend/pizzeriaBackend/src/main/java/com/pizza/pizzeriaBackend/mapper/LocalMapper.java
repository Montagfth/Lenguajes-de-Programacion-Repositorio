package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.LocalCreateDto;
import com.pizza.pizzeriaBackend.dto.response.LocalResponseDto;
import com.pizza.pizzeriaBackend.model.Local;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class LocalMapper {

    public Local toEntity(LocalCreateDto dto) {
        if (dto == null) return null;
        return Local.builder()
                .nombre(dto.nombre())
                .direccion(dto.direccion())
                .ciudad(dto.ciudad())
                .telefono(dto.telefono())
                .email(dto.email())
                .capacidad(dto.capacidad())
                .horarioApertura(dto.horarioApertura())
                .horarioCierre(dto.horarioCierre())
                .activo(dto.activo() != null ? dto.activo() : true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public LocalResponseDto toResponse(Local entity) {
        if (entity == null) return null;
        return new LocalResponseDto(
                entity.getId(),
                entity.getNombre(),
                entity.getDireccion(),
                entity.getCiudad(),
                entity.getTelefono(),
                entity.getEmail(),
                entity.getCapacidad(),
                entity.getHorarioApertura(),
                entity.getHorarioCierre(),
                entity.isActivo(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
