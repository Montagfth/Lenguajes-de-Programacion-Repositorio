package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.ContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.ContactoResponseDto;
import com.pizza.pizzeriaBackend.service.IContactoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoController {

    private final IContactoService contactoService;

    public ContactoController(IContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @PostMapping
    public ResponseEntity<ContactoResponseDto> crear(@Valid @RequestBody ContactoCreateDto dto) {
        return ResponseEntity.ok(contactoService.crearContacto(dto));
    }

    @GetMapping
    public ResponseEntity<List<ContactoResponseDto>> listar() {
        return ResponseEntity.ok(contactoService.listarContactos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(contactoService.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        contactoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
