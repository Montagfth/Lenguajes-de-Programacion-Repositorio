package com.pizza.pizzeriaBackend.service;

import com.pizza.pizzeriaBackend.dto.request.ContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ContactoResponseDto;
import java.util.List;

public interface IContactoService {
    ContactoResponseDto crearContacto(ContactoCreateDto dto);
    List<ContactoResponseDto> listarContactos();
    ContactoResponseDto obtenerPorId(Long id);
    void eliminar(Long id);
}
