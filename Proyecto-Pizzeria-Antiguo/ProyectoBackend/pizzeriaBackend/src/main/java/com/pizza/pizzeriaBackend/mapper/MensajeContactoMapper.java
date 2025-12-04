package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.MensajeContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.MensajeContactoResponseDto;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.model.Local;
import com.pizza.pizzeriaBackend.model.MensajeContacto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MensajeContactoMapper {

    public MensajeContacto toEntity(MensajeContactoCreateDto dto) {
        return MensajeContacto.builder()
                .medio(dto.medio())
                .mensaje(dto.mensaje())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public MensajeContactoResponseDto toResponse(MensajeContacto entity) {
        if (entity == null) return null;
        return new MensajeContactoResponseDto(
                entity.getId(),
                entity.getMedio(),
                entity.getMensaje(),
                entity.getCreatedAt(),
                entity.getContacto().getId(),
                entity.getLocal() != null ? entity.getLocal().getId() : null
        );
    }
}
