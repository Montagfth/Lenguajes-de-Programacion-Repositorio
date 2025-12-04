package com.pizza.pizzeriaBackend.mapper;

import com.pizza.pizzeriaBackend.dto.request.ContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ContactoResponseDto;
import com.pizza.pizzeriaBackend.model.Contacto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ContactoMapper {

    public Contacto toEntity(ContactoCreateDto dto) {
        if (dto == null) return null;
        return Contacto.builder()
                .nombre(dto.nombre())
                .email(dto.email())
                .telefono(dto.telefono())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public ContactoResponseDto toResponse(Contacto entity) {
        if (entity == null) return null;
        return new ContactoResponseDto(
                entity.getId(),
                entity.getNombre(),
                entity.getEmail(),
                entity.getTelefono(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}