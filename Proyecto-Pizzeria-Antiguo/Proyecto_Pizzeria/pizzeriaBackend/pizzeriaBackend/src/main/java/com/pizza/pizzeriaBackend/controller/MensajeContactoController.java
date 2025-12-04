package com.pizza.pizzeriaBackend.controller;

import com.pizza.pizzeriaBackend.dto.request.MensajeContactoCreateDto;
import com.pizza.pizzeriaBackend.dto.response.MensajeContactoResponseDto;
import com.pizza.pizzeriaBackend.service.IMensajeContactoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeContactoController {

    private final IMensajeContactoService mensajeService;

    public MensajeContactoController(IMensajeContactoService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @PostMapping
    public ResponseEntity<MensajeContactoResponseDto> crear(@Valid @RequestBody MensajeContactoCreateDto dto) {
        return ResponseEntity.ok(mensajeService.crearMensaje(dto));
    }

    @GetMapping
    public ResponseEntity<List<MensajeContactoResponseDto>> listar() {
        return ResponseEntity.ok(mensajeService.listarMensajes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MensajeContactoResponseDto> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(mensajeService.obtenerPorId(id));
    }

    @GetMapping("/contacto/{contactoId}")
    public ResponseEntity<List<MensajeContactoResponseDto>> listarPorContacto(@PathVariable Long contactoId) {
        return ResponseEntity.ok(mensajeService.listarPorContacto(contactoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mensajeService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
