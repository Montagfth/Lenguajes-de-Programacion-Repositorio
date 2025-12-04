package com.pizza.pizzeriaBackend.service.impl;

import com.pizza.pizzeriaBackend.dto.request.ContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ContactoResponseDto;
import com.pizza.pizzeriaBackend.mapper.ContactoMapper;
import com.pizza.pizzeriaBackend.model.Contacto;
import com.pizza.pizzeriaBackend.repository.ContactoRepository;
import com.pizza.pizzeriaBackend.service.IContactoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactoService implements IContactoService {

    private final ContactoRepository contactoRepository;
    private final ContactoMapper contactoMapper;

    public ContactoService(ContactoRepository contactoRepository, ContactoMapper contactoMapper) {
        this.contactoRepository = contactoRepository;
        this.contactoMapper = contactoMapper;
    }

    @Override
    public ContactoResponseDto crearContacto(ContactoCreateDto dto) {
        Contacto contacto = contactoMapper.toEntity(dto);
        contactoRepository.save(contacto);
        return contactoMapper.toResponse(contacto);
    }

    @Override
    public List<ContactoResponseDto> listarContactos() {
        return contactoRepository.findAll()
                .stream()
                .map(contactoMapper::toResponse)
                .toList();
    }

    @Override
    public ContactoResponseDto obtenerPorId(Long id) {
        return contactoRepository.findById(id)
                .map(contactoMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Contacto no encontrado con id: " + id));
    }

    @Override
    public void eliminar(Long id) {
        contactoRepository.deleteById(id);
    }
}
